angular.module('chatty')
    .service('chattyService', function($q, $http, $timeout) {
        var lastEventId = 0;
        var threads = [];
        var postDb = {};
        var chattyService = {};

        chattyService.fullLoad = function fullLoad() {
            var deferred = $q.defer();

            $http.get('http://winchatty.com/v2/getNewestEventId')
                .success(function(data) {
                    lastEventId = data.eventId;
                }).error(function(data) {
                    deferred.reject(data);
                });

            $http.get('https://winchatty.com/v2/getChatty')
                .success(function(data) {
                    deferred.resolve(threads);

                    //process more after we've responded
                    processThreads(data.threads);
                }).error(function(data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        function processThreads(newThreads) {
            $timeout(function() {
                var thread = fixThread(newThreads.shift());
                threads.push(thread);

                if (newThreads.length > 0) {
                    return processThreads(newThreads);
                } else {
                    return waitForEvents();
                }
            });
        }

        function waitForEvents() {
            $http.get('http://winchatty.com/v2/waitForEvent?lastEventId=' + lastEventId)
                .success(function(data) {
                    lastEventId = data.lastEventId;

                    data.events.forEach(newEvent);

                    waitForEvents();
                }).error(function(data) {
                    console.log('Error in waitForEvents: ', data);
                });
        }

        function newEvent(event) {
            var thread, post;

            if (event.eventType === 'newPost') {
                if (event.eventData.post.parentId === 0) {
                    console.log('New root post', event.eventData.post);
                    thread = {
                        threadId: event.eventData.threadId,
                        rootPost: fixPost(event.eventData.post),
                        posts: []
                    };
                    threads.unshift(thread);
                    postDb[thread.threadId] = thread;
                } else {
                    console.log('New reply', event.eventData.post);
                    var parent = postDb[event.eventData.post.parentId];
                    if (parent) {
                        post = fixPost(event.eventData.post);
                        parent.posts.push(post);
                        postDb[post.id] =post;
                    } else {
                        console.log('Parent post not found', event.eventData.post.parentId);
                    }
                }
            } else if (event.eventType === 'categoryChange') {
                console.log('Category change', event);
                post = postDb[event.eventData.postId];
                if (post) {
                    if (event.eventData.category === 'nuked') {
                        if (post.post) {
                            _.pull(postDb, post.post);
                        } else {
                            _.pull(threads, post.thread);
                        }
                    } else {
                        post.post.category = event.eventData.category;
                    }
                } else {
                    console.log('Post not found', event.eventData.postId);
                }
            } else {
                console.log('New event', event);
            }
        }

        function fixThread(thread) {
            var posts = _.sortBy(thread.posts, 'date');
            thread.posts = [];

            _.forEach(posts, function(post) {
                //various post fixes
                fixPost(post);

                //figure out where post belongs
                if (post.parentId === 0) {
                    //root post
                    thread.rootPost = post;

                    //attach to master post list
                    postDb[post.id] = thread;
                } else {
                    //attach to master post list
                    postDb[post.id] = post;
                }
            });

            //remove root to prevent iterating again
            _.pull(posts, thread.rootPost);

            //create nested replies
            _.forEach(posts, function(post) {
                var parent = postDb[post.parentId];
                if (parent) {
                    parent.posts.push(post);
                } else {
                    console.log('Orphan post: ', post);
                }
            });

            return thread;
        }

        function fixPost(post) {
            //create the one-liner used for reply view
            var stripped = post.body.replace(/<[^>]+>/gm, '');
            post.oneline = stripped.slice(0, 106) + (stripped.length > 106 ? '...' : '');

            //create sub-post container
            post.posts = [];

            return post;
        }

        return chattyService;
    });