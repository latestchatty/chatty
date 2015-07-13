angular.module('chatty')
    .service('actionService', function($rootScope, $q, apiService, modelService, settingsService) {
        var actionService = {}

        var lastReply

        actionService.setThread = function(thread) {
            lastReply = thread
        }

        actionService.login = function(username, password) {
            var deferred = $q.defer()
            settingsService.clearCredentials()

            if (username && password) {
                apiService.login(username, password)
                    .success(function(data) {
                        var result = data && data.isValid
                        if (result) {
                            settingsService.setCredentials(username, password)
                        }
                        deferred.resolve(result)
                    }).error(function() {
                        deferred.resolve(false)
                    })
            } else {
                deferred.resolve(false)
            }

            return deferred.promise
        }

        actionService.logout = function() {
            settingsService.clearCredentials()

            //close reply boxes
            var threads = modelService.getThreads()
            _.each(threads, actionService.closeReplyBox)
        }

        actionService.reflowThreads = function() {
            var threads = modelService.getThreads()
            var tempThreads = [].concat(threads)
            threads.length = 0

            var sorted = _.sortBy(tempThreads, 'lastPostId')
            while (sorted.length) {
                var thread = sorted.pop()

                if (thread.expirePercent < 100 || thread.pinned) {
                    if (settingsService.isCollapsed(thread.id)) {
                        if (thread.state !== 'collapsed') {
                            thread.state = 'collapsed'
                            thread.visible = false
                            $rootScope.$broadcast('thread-collapse' + thread.id)
                        }
                        threads.push(thread)
                    } else {
                        if (thread.replyCount > 10 && thread.state !== 'truncated') {
                            thread.state = 'truncated'
                            $rootScope.$broadcast('thread-truncate' + thread.id)
                        } else if (thread.state === 'collapsed') {
                            delete thread.state
                            $rootScope.$broadcast('thread-collapse' + thread.id)
                        }
                        collapseReply(thread)
                        closeReplyBox(thread)

                        if (thread.pinned) {
                            threads.unshift(thread)
                        } else {
                            threads.push(thread)
                        }
                    }
                } else {
                    //removing thread from model
                    settingsService.uncollapseThread(thread.id)
                }
            }

            //new threads in at top after reflow
            var newThreads = modelService.getNewThreads()
            while (newThreads.length) {
                threads.unshift(newThreads.pop())
            }
        }

        actionService.togglePinThread = function(thread) {
            if (thread.pinned) {
                thread.pinned = false

                //update local storage
                settingsService.unpinThread(thread.id)
            } else {
                thread.pinned = true

                //update local storage
                settingsService.pinThread(thread.id)
            }
        }

        actionService.collapseThread = function(thread) {
            //collapse thread
            thread.visible = false
            closeReplyBox(thread)
            thread.state = 'collapsed'
            $rootScope.$broadcast('thread-collapse' + thread.id)

            //update local storage
            settingsService.collapseThread(thread.id)
        }

        actionService.expandThread = function(thread) {
            thread.state = 'expanded'
            $rootScope.$broadcast('thread-collapse' + thread.id)
            $rootScope.$broadcast('thread-truncate' + thread.id)

            //update local storage
            settingsService.uncollapseThread(thread.id)
        }

        actionService.expandReply = function(post) {
            var thread = resetThread(post, true)

            //expand
            thread.currentComment = post
            lastReply = post
            post.viewFull = true

            $rootScope.$broadcast('reply-collapse' + post.id)
        }

        function resetThread(post, closeComment) {
            var thread = modelService.getPostThread(post)

            //close any other actions
            actionService.expandThread(thread)
            closeReplyBox(thread)
            if (closeComment) {
                collapseReply(thread)
            }
            return thread
        }

        function collapseReply(thread) {
            if (thread.currentComment) {
                var id = thread.currentComment.id
                delete thread.currentComment.viewFull

                $rootScope.$broadcast('reply-collapse' + id)
            }
        }

        actionService.previousReply = function() {
            selectPost(-1)
        }

        actionService.nextReply = function() {
            selectPost(1)
        }

        function selectPost(increment) {
            if (lastReply) {
                var parent = modelService.getPost(lastReply.threadId)
                if (parent) {
                    var index = _.indexOf(parent.posts, lastReply) + increment
                    if (index >= 0 && parent.posts.length > index) {
                        actionService.expandReply(parent.posts[index])
                    }
                }
            }
        }

        actionService.collapsePostReply = function(post) {
            if (post) {
                resetThread(post, true)
            } else if (lastReply) {
                actionService.collapsePostReply(lastReply)
                lastReply = null
            }
        }

        actionService.openReplyBox = function(post) {
            var thread = resetThread(post)

            //open reply
            thread.replyingToPost = post
            post.replying = true
            $rootScope.$broadcast('post-reply' + thread.id)
        }

        actionService.closePostReplyBox = function(post) {
            var thread = modelService.getPostThread(post)
            closeReplyBox(thread)
        }

        function closeReplyBox(thread) {
            if (thread.replyingToPost) {
                delete thread.replyingToPost.replying
                delete thread.replyingToPost
                $rootScope.$broadcast('post-reply' + thread.id)
            }
        }

        return actionService
    })
