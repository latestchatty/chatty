angular.module('chatty', ['ngRoute', 'ngSanitize', 'LocalStorageModule'])
    .config(function($routeProvider, localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('chatty')

        $routeProvider
            .when('/chatty', {
                templateUrl: 'chatty/chatty.html',
                controller: 'chattyCtrl',
                resolve: {
                    load: function(settingsService, eventService) {
                        settingsService.refresh()
                            .then(function() {
                                eventService.startActive()
                            })
                    }
                }
            })
            .when('/thread/:threadId/:commentId?', {
                templateUrl: 'thread/viewThread.html',
                controller: 'viewThreadCtrl',
                resolve: {
                    load: function(eventService) {
                        eventService.startPassive()
                    },
                    post: function($route, $location, apiService, modelService) {
                        var threadId = $route.current.params.threadId
                        if (threadId) {
                            return apiService.getThread(threadId).then(function(response) {
                                var post = response.data.threads[0]
                                if (threadId !== post.threadId) {
                                    $location.url('/thread/' + post.threadId + '/' + threadId)
                                } else {
                                    return modelService.addThread(post)
                                }
                            })
                        }
                    }
                }
            })
            .otherwise({
                redirectTo: '/chatty'
            })
    })
