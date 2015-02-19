angular.module('chatty')
    .service('postService', function($q, $timeout, apiService, settingsService) {
        var postService = {};

        var posting = false;
        var lastTimeout = null;
        var postQueue = [];

        postService.getQueue = function() {
            return postQueue;
        };
        
        postService.clearQueue = function() {
            $timeout.cancel(lastTimeout);
            posting = false;

            while (postQueue.length) {
                postQueue.pop();
            }
        };

        postService.submitPost = function(parentId, body) {
            postQueue.push({ parentId: parentId, body: body });

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
                    
                    startPosting();
                }, function(data) {
                    if (data && data.error && data.code === 'ERR_INVALID_LOGIN') {
                        settingsService.clearCredentials();
                        postService.clearQueue();
                    } else if (data && data.error &&
                        (data.code === 'ERR_BANNED' || data.code === 'ERR_NUKED' || data.code === 'ERR_SERVER')) {
                        console.log('Error creating post.', data);
                        _.pull(postQueue, post);
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

        return postService;
    });
