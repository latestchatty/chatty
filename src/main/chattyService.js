angular.module('chatty')
    .service('chattyService', function($q, $http, $timeout, localStorageService) {
        var lastEventId = 0;
        var threads = [];
        var postDb = {};
        var chattyService = {};
        var collapsedThreads = angular.fromJson(localStorageService.get('collapsedThreads')) || [];

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
                    processThreads(data.threads, []);
                }).error(function(data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        function processThreads(newThreads, collapsed) {
            $timeout(function() {
                var thread = fixThread(newThreads.shift());
                if (thread.collapsed) {
                    //don't add collapsed threads in until end
                    collapsed.push(thread);
                } else {
                    threads.push(thread);
                }

                if (newThreads.length > 0) {
                    //process more
                    return processThreads(newThreads, collapsed);
                } else {
                    //add collapsed threads in at end
                    _.each(collapsed, function(thread) {
                        threads.push(thread);
                    });

                    //clean up collapsed thread list
                    _.remove(collapsedThreads, function(id) {
                        return !postDb[id];
                    });
                    localStorageService.set('collapsedThreads', collapsedThreads);

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

            //check if it's supposed to be collapsed
            if (collapsedThreads.indexOf(thread.threadId) >= 0) {
                thread.collapsed = true;
            }

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

        chattyService.collapseThread = function chattyService(thread) {
            thread.collapsed = true;

            //move to the end of the list
            _.pull(threads, thread);
            threads.push(thread);

            //update local storage
            if (collapsedThreads.indexOf(thread.threadId) < 0) {
                collapsedThreads.push(thread.threadId);

                localStorageService.set('collapsedThreads', collapsedThreads);
            }
        };

        chattyService.expandThread = function expandThread(thread) {
            delete thread.collapsed;

            //update local storage
            _.pull(collapsedThreads, thread.threadId);
            localStorageService.set('collapsedThreads', collapsedThreads);
        };

        chattyService.expandReply = function expandReply(post) {
            var parent = postDb[post.threadId];
            if (parent.currentComment) {
                //unset previous reply
                delete parent.currentComment.viewFull;
            }

            parent.currentComment = post;
            post.viewFull = true;
        };

        chattyService.collapseReply = function collapseReply(post) {
            var parent = postDb[post.threadId];
            delete parent.currentComment;

            delete post.viewFull;
        };

        return chattyService;
    });