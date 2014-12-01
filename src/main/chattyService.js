angular.module('chatty')
    .service('chattyService', function($q, $http, $timeout, localStorageService) {
        var lastEventId = 0;
        var threads = [];
        var postDb = {};
        var chattyService = {};
        var collapsedThreads = angular.fromJson(localStorageService.get('collapsedThreads')) || [];
        var credentials = angular.fromJson(localStorageService.get('credentials')) || null;
        var replyingToPost = null;

        chattyService.fullLoad = function fullLoad() {
            var deferred = $q.defer();

            $http.get('http://winchatty.com/v2/getNewestEventId')
                .success(function(data) {
                    lastEventId = data.eventId;
                }).error(function(data) {
                    deferred.reject(data);
                });

            $http.get('http://winchatty.com/v2/getChatty')
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
                    thread = fixThread({
                        threadId: event.eventData.threadId,
                        posts: [ event.eventData.post ]
                    });
                    threads.unshift(thread);
                    postDb[thread.threadId] = thread;
                } else {
                    thread = postDb[event.eventData.post.threadId];
                    var parent = postDb[event.eventData.post.parentId];
                    if (parent && thread) {
                        post = fixPost(event.eventData.post);
                        addUserHighlight(post, thread);
                        updateLineClass(post, thread);

                        parent.posts.push(post);
                        postDb[post.id] = post;
                    } else {
                        console.log('Parent post not found for event: ', event);
                    }
                }
            } else if (event.eventType === 'categoryChange') {
                post = postDb[event.eventData.postId];
                if (post) {
                    if (event.eventData.category === 'nuked') {
                        if (post.post) {
                            _.pull(postDb, post.post);
                        } else {
                            _.pull(threads, post.thread);
                        }
                    } else {
                        post.category = event.eventData.category;
                    }
                } else {
                    console.log('Post not found for event: ', event);
                }
            } else {
                console.log('Unhandled event', event);
            }
        }

        function fixThread(thread) {
            var posts = _.sortBy(thread.posts, 'id');
            thread.posts = [];

            //handle root post
            var rootPost = _.find(posts, { parentId: 0 });
            _.pull(posts, rootPost);
            thread.id = rootPost.id;
            thread.author = rootPost.author;
            thread.date = rootPost.date;
            thread.category = rootPost.category;
            thread.body = rootPost.body;
            thread.parentId = 0;
            thread.recent = [];
            postDb[thread.id] = thread;

            while(posts.length > 0) {
                var post = posts.shift();

                //various post fixes
                fixPost(post);

                //user highlighting
                addUserHighlight(post, thread);

                //add to post db
                postDb[post.id] = post;

                //create nested replies
                var parent = postDb[post.parentId];
                parent.posts.push(post);

                //line coloring
                if (posts.length < 10) {
                    //post.lineClass = 'oneline' + posts.length;
                    //thread.recent.push(post);
                    updateLineClass(post, thread);
                }
            }

            //check if it's supposed to be collapsed
            if (collapsedThreads.indexOf(thread.threadId) >= 0) {
                thread.collapsed = true;
            }

            return thread;
        }

        function fixPost(post) {
            if (!post.oneline) {
                //create the one-liner used for reply view
                var stripped = post.body.replace(/<[^>]+>/gm, '');
                post.oneline = stripped.slice(0, 106) + (stripped.length > 106 ? '...' : '');

                //create sub-post container
                post.posts = post.posts || [];
            }

            return post;
        }

        function addUserHighlight(post, thread) {
            //add user class highlight
            if (post.author === thread.author) {
                post.userClass = 'user_op';
            } else if (credentials && post.author === credentials.username) {
                post.userClass = 'user_me';
            }
        }

        function updateLineClass(post, thread) {
            thread.recent.push(post);

            if (thread.recent.length > 10) {
                thread.recent.shift();
            }

            _.each(thread.recent, function(recentPost, index) {
                recentPost.lineClass = 'oneline' + (9 - index);
            });
        }

        chattyService.collapseThread = function collapseThread(thread) {
            thread.collapsed = true;
            delete thread.replying;

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
            delete post.replying;
        };

        chattyService.openReplyBox = function openReplyBox(post) {
            //close previous reply window
            if (replyingToPost) {
                delete replyingToPost.replying;
            }

            replyingToPost = post;
            post.replying = true;
        };

        chattyService.getUsername = function getUsername() {
            return credentials ? credentials.username : null;
        };

        chattyService.login = function login(username, password) {
            var deferred = $q.defer();
            credentials = null;
            localStorageService.remove('credentials');

            if (username && password) {
                var params = {
                    username: username,
                    password: password
                };

                post('https://winchatty.com/v2/verifyCredentials', params)
                    .success(function(data) {
                        var result = data && data.isValid;
                        if (result) {
                            credentials = {
                                username: username,
                                password: password
                            };
                            localStorageService.set('credentials', credentials);
                        }
                        deferred.resolve(result);
                    }).error(function() {
                        deferred.resolve(false);
                    });
            } else {
                deferred.resolve(false);
            }

            return deferred.promise;
        };

        chattyService.logout = function logout() {
            credentials = null;
            localStorageService.remove('credentials');

            //close reply box
            if (replyingToPost) {
                delete replyingToPost.replying;
            }
            replyingToPost = null;
        };

        chattyService.submitPost = function submitPost(id, body) {
            var deferred = $q.defer();

            var params = {
                username: credentials.username,
                password: credentials.password,
                parentId: id,
                text: body
            };

            post('https://winchatty.com/v2/postComment', params)
                .success(function(data) {
                    deferred.resolve(data.result && data.result == 'success');
                }).error(function() {
                    deferred.resolve(false);
                });

            return deferred.promise;
        };

        function post(url, params) {
            var data = _.reduce(params, function(result, value, key) {
                return result + (result.length > 0 ? '&' : '') + key + '=' + encodeURIComponent(value);
            }, '');

            var config = {
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };

            return $http(config);
        }

        return chattyService;
    });