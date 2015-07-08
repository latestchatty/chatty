angular.module('chatty', ['ngRoute', 'ngSanitize', 'RecursionHelper', 'LocalStorageModule'],
    function($rootScopeProvider) {
        //necessary to allow commentDirective to be recursive
        $rootScopeProvider.digestTtl(60)

    }).config(function($routeProvider, localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('chatty')

        $routeProvider
            .when('/chatty', {
                templateUrl: 'chatty/chatty.html',
                controller: 'chattyCtrl',
                resolve: {
                    load: function(settingsService, eventService) {
                        settingsService.refresh()
                            .then(function() {
                                eventService.load()
                            })
                    }
                }
            })
            .when('/thread/:threadId/:commentId?', {
                templateUrl: 'thread/viewThread.html',
                controller: 'viewThreadCtrl',
                resolve: {
                    post: function($route, $location, apiService, modelService) {
                        var threadId = $route.current.params.threadId
                        if (threadId) {
                            var post = modelService.getPost(threadId)
                            if (!post) {
                                return apiService.getThread(threadId).then(function(response) {
                                    post = response.data.threads[0]
                                    if (threadId !== post.threadId) {
                                        $location.url('/thread/' + post.threadId + '/' + threadId)
                                        $route.reload()
                                    } else {
                                        return modelService.addThread(post)
                                    }
                                })
                            } else if (threadId === post.threadId) {
                                return post
                            } else {
                                $location.url('/thread/' + post.threadId + '/' + threadId)
                                $route.reload()
                            }
                        }
                    }
                }
            })
            .otherwise({
                redirectTo: '/chatty'
            })
    })
