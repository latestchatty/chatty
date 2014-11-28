angular.module('chatty')
    .controller('chattyCtrl', function($scope, $http) {
        $scope.threads = [];
        $scope.eventId = 0;
        $scope.error = null;

        $http.get('http://winchatty.com/v2/getNewestEventId')
            .success(function(data) {
                $scope.eventId = data.eventId;
            }).error(function(data) {
                $scope.error = data;
            });

        $http.get('https://winchatty.com/v2/getChatty')
            .success(function(data) {
                $scope.threads = data.threads.map(fixThread);

                waitForEvents();
            }).error(function(data) {
                $scope.error = data;
            });

        function waitForEvents() {
            $http.get('http://winchatty.com/v2/waitForEvent?lastEventId=' + $scope.eventId)
                .success(function(data) {
                    $scope.eventId = data.lastEventId;

                    data.events.forEach(newEvent);

                    waitForEvents();
                }).error(function(data) {
                    $scope.error = data;
                });
        }

        function newEvent(event) {
            var thread, post;

            if (event.eventType === 'newPost') {
                if (event.eventData.post.parentId === 0) {
                    console.log('New root post', event.eventData.post);
                    thread = fixThread({
                        threadId: event.eventData.threadId,
                        rootPost: event.eventData.post,
                        posts: []
                    });
                    $scope.threads.unshift(thread);
                } else {
                    console.log('New reply', event.eventData.post);
                    thread = getThread(event.eventData.post.threadId);
                    if (thread) {
                        post = fixPost(event.eventData.post);
                        thread.posts.push(post);
                    } else {
                        console.log('Parent thread not found', event.eventData.post.threadId);
                    }
                }
            } else if (event.eventType === 'categoryChange') {
                console.log('Category change', event);
                post = getPost(event.eventData.postId);
                if (post) {
                    if (event.eventData.category === 'nuked') {
                        if (post.post) {
                            _.pull($scope.posts, post.post);
                        } else {
                            _.pull($scope.threads, post.thread);
                        }
                    } else {

                    }
                } else {
                    console.log('Post not found', event.eventData.postId);
                }
            } else {
                console.log('New event', event);
            }
        }

        function getThread(id) {
            return _.find($scope.threads, function(thread) {
                return thread.threadId == id;
            });
        }

        function getPost(id) {
            var post = {};
            post.thread = _.find($scope.threads, function(thread) {
                post.post = _.find(thread.posts, function(post) {
                    return post && post.id == id;
                });
                return !!post.post;
            });
            return post;
        }

        function fixThread(thread) {
            thread.posts.forEach(function(post) {
                fixPost(post);

                if (post.parentId === 0) {
                    //pull the root post out of post list
                    _.pull(thread.posts, post);
                    thread.rootPost = post;
                }
            });

            return thread;
        }

        function fixPost(post) {
            //create the one-liner used for reply view
            post.oneline = stripHtml(post.body).slice(0, 106);
        }

        function stripHtml(input) {
            return input.replace(/<[^>]+>/gm, '');
        }
    });