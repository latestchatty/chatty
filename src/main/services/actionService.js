angular.module('chatty')
    .service('actionService', function($rootScope, $q, apiService, modelService, settingsService) {
        var actionService = {};

        var lastReply;

        actionService.login = function login(username, password) {
            var deferred = $q.defer();
            settingsService.clearCredentials();

            if (username && password) {
                apiService.login(username, password)
                    .success(function(data) {
                        var result = data && data.isValid;
                        if (result) {
                            settingsService.setCredentials(username, password);
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

        actionService.logout = function logout() {
            settingsService.clearCredentials();

            //close reply boxes
            var threads = modelService.getThreads();
            _.each(threads, actionService.closeReplyBox);
        };

        actionService.submitPost = function submitPost(parentId, body) {
            var deferred = $q.defer();

            if (settingsService.isLoggedIn()) {
                apiService.submitPost(settingsService.getUsername(), settingsService.getPassword(), parentId, body)
                    .success(function(data) {
                        deferred.resolve(data.result && data.result === 'success');
                    }).error(function() {
                        deferred.resolve(false);
                    });
            } else {
                deferred.resolve(false);
            }

            return deferred.promise;
        };

        actionService.reflowThreads = function reflowThreads() {
            var threads = modelService.getThreads();
            var tempThreads = [].concat(threads);
            threads.length = 0;

            var collapsed = [];
            var sorted = _.sortBy(tempThreads, 'lastPostId');
            while (sorted.length) {
                var thread = sorted.pop();

                if (thread.expirePercent < 100) {
                    if (settingsService.isCollapsed(thread.id)) {
                        if (thread.state !== 'collapsed') {
                            thread.state = 'collapsed';
                            $rootScope.$broadcast('thread-collapse' + thread.id);
                        }
                        collapsed.push(thread);
                    } else {
                        if (thread.replyCount > 10 && thread.state !== 'truncated') {
                            thread.state = 'truncated';
                            $rootScope.$broadcast('thread-truncate' + thread.id);
                        } else if (thread.state === 'collapsed') {
                            delete thread.state;
                            $rootScope.$broadcast('thread-collapse' + thread.id);
                        }
                        collapseReply(thread);
                        closeReplyBox(thread);

                        threads.push(thread);
                    }
                } else {
                    //removing thread from model
                    settingsService.uncollapseThread(thread.id);
                }
            }

            //new threads in at top after reflow
            var newThreads = modelService.getNewThreads();
            while (newThreads.length) {
                threads.unshift(newThreads.pop());
            }

            //add collapsed threads in at end
            while (collapsed.length) {
                threads.push(collapsed.pop());
            }
        };

        actionService.collapseThread = function collapseThread(thread) {
            var threads = modelService.getThreads();
            _.pull(threads, thread);

            //collapse thread
            closeReplyBox(thread);
            thread.state = 'collapsed';
            $rootScope.$broadcast('thread-collapse' + thread.id);

            //add to the end of the list
            threads.push(thread);

            //update local storage
            settingsService.collapseThread(thread.id);
        };

        actionService.expandThread = function expandThread(thread) {
            thread.state = 'expanded';
            $rootScope.$broadcast('thread-collapse' + thread.id);
            $rootScope.$broadcast('thread-truncate' + thread.id);

            //update local storage
            settingsService.uncollapseThread(thread.id);
        };

        actionService.expandReply = function expandReply(post) {
            var thread = resetThread(post, true);

            //expand
            thread.currentComment = post;
            lastReply = post;
            post.viewFull = true;

            $rootScope.$broadcast('reply-collapse' + post.id);
        };

        function resetThread(post, closeComment) {
            var thread = modelService.getPostThread(post);

            //close any other actions
            actionService.expandThread(thread);
            closeReplyBox(thread);
            if (closeComment) {
                collapseReply(thread);
            }
            return thread;
        }

        function collapseReply(thread) {
            if (thread.currentComment) {
                var id = thread.currentComment.id;
                delete thread.currentComment.viewFull;

                $rootScope.$broadcast('reply-collapse' + id);
            }
        }

        actionService.previousReply = function previousReply() {
            if (lastReply) {
                var parent = modelService.getPost(lastReply.parentId);
                if (parent) {
                    var index = parent.posts.indexOf(lastReply);
                    if (index === 0 && parent.parentId > 0) {
                        actionService.expandReply(parent);
                    } else if (index > 0) {
                        var next = parent.posts[index - 1];
                        var last = findLastReply(next);
                        actionService.expandReply(last);
                    }
                }
            }
        };

        function findLastReply(post) {
            if (post.posts.length) {
                return findLastReply(_.last(post.posts));
            } else {
                return post;
            }
        }

        actionService.nextReply = function nextReply() {
            if (lastReply) {
                processNextReply(lastReply);
            }
        };

        function processNextReply(post, skipChildren) {
            if (!skipChildren && post.posts.length) {
                actionService.expandReply(post.posts[0]);
            } else {
                var parent = modelService.getPost(post.parentId);
                if (parent) {
                    var index = parent.posts.indexOf(post);
                    if (index + 1 < parent.posts.length) {
                        var next = parent.posts[index + 1];
                        actionService.expandReply(next);
                    } else {
                        processNextReply(parent, true);
                    }
                }
            }
        }

        actionService.collapsePostReply = function collapsePostReply(post) {
            if (post) {
                resetThread(post, true);
            } else if (lastReply) {
                actionService.collapsePostReply(lastReply);
                lastReply = null;
            }
        };

        actionService.openReplyBox = function openReplyBox(post) {
            var thread = resetThread(post);

            //open reply
            thread.replyingToPost = post;
            post.replying = true;
            $rootScope.$broadcast('post-reply' + thread.id);
        };

        actionService.closePostReplyBox = function closePostReplyBox(post) {
            var thread = modelService.getPostThread(post);
            closeReplyBox(thread);
        };

        function closeReplyBox(thread) {
            if (thread.replyingToPost) {
                delete thread.replyingToPost.replying;
                delete thread.replyingToPost;
                $rootScope.$broadcast('post-reply' + thread.id);
            }
        }

        return actionService;
    });