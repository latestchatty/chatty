angular.module('chatty')
    .service('eventService', function($timeout, $interval, apiService, modelService, settingsService, tabService, shackMessageService) {
        var eventService = {};
        var lastEventId = 0;

        //fresh load of full chatty
        eventService.load = function() {
            modelService.clear();

            apiService.getNewestEventId()
                .success(function(data) {
                    lastEventId = data.eventId;
                }).error(function(data) {
                    console.log('Error during getNewestEventId: ', data);
                });

            apiService.getChatty()
                .success(function(data) {
                    processChatty(data.threads, []);
                }).error(function(data) {
                    console.log('Error during getChatty: ', data);
                });
                
            shackMessageService.refresh();
        };

        function processChatty(newThreads, collapsedThreads) {
            if (newThreads.length > 0) {
                var thread = newThreads.shift();

                if (settingsService.isCollapsed(thread.threadId)) {
                    collapsedThreads.push(thread);
                } else {
                    modelService.addThread(thread);
                }

                processChatty(newThreads, collapsedThreads);
            } else {
                //add collapsed threads in at end
                while(collapsedThreads.length) {
                    modelService.addThread(collapsedThreads.pop());
                }

                //clean collapsed thread list after initial load
                modelService.cleanCollapsed();

                //start events
                return waitForEvents();
            }
        }

        function waitForEvents() {
            apiService.waitForEvent(lastEventId)
                .success(function(data) {
                    eventResponse(data);
                }).error(function(data) {
                    console.log('Error during waitForEvent: ', data);
                    eventResponse(data);
                });
        }

        function eventResponse(data) {
            if (data && !data.error) {
                lastEventId = data.lastEventId;

                //process the events
                data.events.forEach(newEvent);

                //wait for more
                waitForEvents();
            } else {
                if (data && data.error && data.code === 'ERR_TOO_MANY_EVENTS') {
                    console.log('Too many events since last refresh, reloading chatty.');
                    eventService.load();
                } else {
                    //restart events in 30s
                    $timeout(function() {
                        waitForEvents();
                    }, 30000)
                }
            }
        }

        function newEvent(event) {
            if (event.eventType === 'newPost') {
                if (event.eventData.post.parentId === 0) {
                    modelService.addThread(event.eventData.post, true);
                } else {
                    var data = modelService.addPost(event.eventData.post);
                    if (data) {
                        tabService.newPost(data.thread, data.parent, data.post);
                    }
                }
            } else if (event.eventType === 'categoryChange') {
                modelService.changeCategory(event.eventData.postId, event.eventData.category);
            } else if (event.eventType === 'lolCountsUpdate') {
                //not supported
            } else {
                console.log('Unhandled event', event);
            }
        }

        //update loop every 5 min
        $interval(function() {
            modelService.updateAllThreads();
            shackMessageService.refresh();
            settingsService.refresh();
        }, 300000);

        return eventService;
    });