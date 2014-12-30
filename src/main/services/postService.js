angular.module('chatty')
    .service('postService', function($q, $timeout, apiService, settingsService, localStorageService) {
        var postService = {};

        var posting = false;
        var lastTimeout = null;
        var postQueue = angular.fromJson(localStorageService.get('postQueue')) || [];
        postService.load = function() {
            $timeout(function() {
                startPosting();
            });
        };

        postService.getQueue = function() {
            return postQueue;
        };
        
        postService.loggedIn = function() {
            $timeout(function() {
                startPosting();
            });
        };
        
        postService.clearQueue = function() {
            if (posting) {
                $timeout.cancel(lastTimeout);
                while(postQueue.length) {
                    postQueue.pop();
                }
                save();
            }
        };

        postService.submitPost = function submitPost(parentId, body) {
            postQueue.push({ parentId: parentId, body: body });
            save();

            if (!posting) {
                $timeout(function() {
                    startPosting();
                });
            }
        };
        
        function postToApi(post) {
            var deferred = $q.defer();

            apiService.submitPost(settingsService.getUsername(), settingsService.getPassword(), post.parentId, post.body)
                .success(function(data) {
                    if (data.result && data.result === 'success') {
                        deferred.resolve(true);
                    } else {
                        deferred.reject(data);
                    }
                }).error(function(data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function startPosting() {
            if (settingsService.isLoggedIn() && postQueue.length) {
                posting = true;
                
                var post = postQueue[0];
                postToApi(post).then(function() {
                    _.pull(postQueue, post);
                    save();
                    
                    startPosting();
                }, function(data) {
                    if (data && data.error && data.code === 'ERR_INVALID_LOGIN') {
                        settingsService.clearCredentials();
                    } else if (data && data.error && data.code === 'ERR_BANNED') {
                        _.pull(postQueue, post);
                        save();
                    } else {
                        lastTimeout = $timeout(function() {
                            startPosting();
                        }, 60000);
                    } 
                });
            } else {
                posting = false;
            }
        }
        
        function save() {
            localStorageService.set('postQueue', postQueue);
        }

        return postService;
    });
