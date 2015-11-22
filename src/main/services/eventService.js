var _ = require('lodash')

module.exports = /* @ngInject */
    function($log, $timeout, $interval, $window, apiService, modelService, localStorageService,
             settingsService, tabService, shackMessageService, titleService) {
        var eventService = {}
        var lastEventId = 0
        var passive = false

        //fresh load of full chatty
        eventService.startActive = function() {
            modelService.clear()

            apiService.getNewestEventId()
                .success(function(data) {
                    lastEventId = data.eventId
                })
                .error(function(data) {
                    $log.error('Error during getNewestEventId: ', data)
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
                })
                .error(function(data) {
                    $log.error('Error during getChatty: ', data)
                })

            shackMessageService.refresh()
        }

        eventService.startPassive = function() {
            passive = true
            titleService.clearOnReturn = true

            $window.addEventListener('storage', function(event) {
                if (event.key === 'chatty.event') {
                    var data = JSON.parse(event.newValue)
                    var result = newEvent(data)

                    //update title bar count
                    if (result) {
                        titleService.count++
                        titleService.updateTitle(0)
                    }
                }
            })
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
                        })
                        .error(function(error) {
                            $log.error('Error loading pinned threadId=' + threadId, error)
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
                })
                .error(function(data) {
                    $log.error('Error during waitForEvent: ', data)
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
                    $log.error('Too many events since last refresh, reloading chatty.')
                    eventService.startActive()
                } else {
                    //restart events in 30s
                    $timeout(function() {
                        waitForEvents()
                    }, 30000)
                }
            }
        }

        function newEvent(event) {
            //store the event for other tabs to process
            if (!passive) {
                localStorageService.set('event', event)
            }

            if (event.eventType === 'newPost') {
                if (event.eventData.post.parentId === 0 && !passive) {
                    return modelService.addThread(event.eventData.post, true)
                } else {
                    var data = modelService.addPost(event.eventData.post)
                    if (data) {
                        tabService.newPost(data.thread, data.parent, data.post)
                    }
                    return data
                }
            } else if (event.eventType === 'categoryChange') {
                return modelService.changeCategory(event.eventData.postId, event.eventData.category)
            } else if (event.eventType === 'lolCountsUpdate') {
                //not supported
            } else {
                $log.error('Unhandled event', event)
            }
        }

        //update loop every 5 min
        $interval(function() {
            modelService.updateAllThreads()
            shackMessageService.refresh()
            settingsService.refresh()
        }, 300000)

        return eventService
    }
