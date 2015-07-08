angular.module('chatty')
    .service('eventService', function($timeout, $interval, apiService, modelService, settingsService, tabService, shackMessageService) {
        var eventService = {}
        var lastEventId = 0

        //fresh load of full chatty
        eventService.load = function() {
            modelService.clear()

            apiService.getNewestEventId()
                .success(function(data) {
                    lastEventId = data.eventId
                }).error(function(data) {
                    console.log('Error during getNewestEventId: ', data)
                })

            apiService.getChatty()
                .success(function(data) {
                    //process all threads
                    _.each(data.threads, modelService.addThread)

                    //clean collapsed thread list after initial load
                    modelService.cleanCollapsed()

                    //reorder pinned threads
                    handlePinnedThreads()

                    //start events
                    return waitForEvents()
                }).error(function(data) {
                    console.log('Error during getChatty: ', data)
                })

            shackMessageService.refresh()
        }

        function handlePinnedThreads() {
            var pinnedThreads = settingsService.getPinned()
            var threads = modelService.getThreads()

            _.each(pinnedThreads, function(threadId) {
                var thread = modelService.getPost(threadId)
                if (!thread) {
                    //load expired thread
                    apiService.getThread(threadId)
                        .success(function(data) {
                            if (data.threads && data.threads[0]) {
                                thread = modelService.addThread(data.threads[0])
                                thread.pinned = true

                                //put it at the top of the list
                                _.pull(threads, thread)
                                threads.unshift(thread)
                            }
                        }).error(function(error) {
                            console.log('Error loading pinned threadId=' + threadId, error)
                        })
                } else {
                    //put it at the top of the list
                    thread.pinned = true
                    _.pull(threads, thread)
                    threads.unshift(thread)
                }
            })
        }

        function waitForEvents() {
            apiService.waitForEvent(lastEventId)
                .success(function(data) {
                    eventResponse(data)
                }).error(function(data) {
                    console.log('Error during waitForEvent: ', data)
                    eventResponse(data)
                })
        }

        function eventResponse(data) {
            if (data && !data.error) {
                lastEventId = data.lastEventId

                //process the events
                data.events.forEach(newEvent)

                //wait for more
                waitForEvents()
            } else {
                if (data && data.error && data.code === 'ERR_TOO_MANY_EVENTS') {
                    console.log('Too many events since last refresh, reloading chatty.')
                    eventService.load()
                } else {
                    //restart events in 30s
                    $timeout(function() {
                        waitForEvents()
                    }, 30000)
                }
            }
        }

        function newEvent(event) {
            if (event.eventType === 'newPost') {
                if (event.eventData.post.parentId === 0) {
                    modelService.addThread(event.eventData.post, 'event')
                } else {
                    var data = modelService.addPost(event.eventData.post)
                    if (data) {
                        tabService.newPost(data.thread, data.parent, data.post)
                    }
                }
            } else if (event.eventType === 'categoryChange') {
                modelService.changeCategory(event.eventData.postId, event.eventData.category)
            } else if (event.eventType === 'lolCountsUpdate') {
                //not supported
            } else {
                console.log('Unhandled event', event)
            }
        }

        //update loop every 5 min
        $interval(function() {
            modelService.updateAllThreads()
            shackMessageService.refresh()
            settingsService.refresh()
        }, 300000)

        return eventService
    })
