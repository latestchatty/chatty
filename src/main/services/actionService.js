angular.module('chatty')
    .service('actionService', function($q, $http, $timeout, modelService, settingsService) {
        var actionService = {};

        actionService.login = function login(username, password) {
            var deferred = $q.defer();
            settingsService.clearCredentials();

            if (username && password) {
                var params = {
                    username: username,
                    password: password
                };

                post('https://winchatty.com/v2/verifyCredentials', params)
                    .success(function(data) {
                        var result = data && data.isValid;
                        if (result) {
                            settingsService.setCredentials(params);
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

        actionService.submitPost = function submitPost(id, body) {
            var deferred = $q.defer();

            if (settingsService.isLoggedIn()) {
                var params = {
                    username: settingsService.getUsername(),
                    password: settingsService.getPassword(),
                    parentId: id,
                    text: body
                };

                post('https://winchatty.com/v2/postComment', params)
                    .success(function(data) {
                        deferred.resolve(data.result && data.result == 'success');
                    }).error(function() {
                        deferred.resolve(false);
                    });
            } else {
                deferred.resolve(false);
            }

            return deferred.promise;
        };

        actionService.collapseThread = function collapseThread(thread) {
            var threads = modelService.getThreads();
            _.pull(threads, thread);

            //collapse thread
            thread.collapsed = true;
            actionService.closeReplyBox(thread);

            //add to the end of the list
            threads.push(thread);

            //update local storage
            settingsService.addCollapsed(thread.id);
        };

        actionService.expandThread = function expandThread(thread) {
            delete thread.collapsed;

            //update local storage
            settingsService.removeCollapsed(thread.id);
        };

        actionService.expandReply = function expandReply(post) {
            var parent = modelService.getPost(post.threadId);
            if (parent.currentComment) {
                //unset previous reply
                delete parent.currentComment.viewFull;
            }

            parent.currentComment = post;
            post.viewFull = true;
        };

        actionService.collapseReply = function collapseReply(post) {
            var parent = modelService.getPost(post.threadId);
            delete parent.currentComment;

            delete post.viewFull;
            delete post.replying;
        };

        actionService.openReplyBox = function openReplyBox(post) {
            var thread = modelService.getPostThread(post);

            //close previous reply window
            if (thread.replyingToPost) {
                delete thread.replyingToPost.replying;
            }

            thread.replyingToPost = post;
            post.replying = true;
        };

        actionService.closeReplyBox = function closeReplyBox(post) {
            var thread = modelService.getPostThread(post);
            if (thread.replyingToPost) {
                delete thread.replyingToPost.replying;
                delete thread.replyingToPost;
            }
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

        return actionService;
    });