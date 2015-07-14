angular.module('chatty')
    .service('modelService', function($rootScope, settingsService, bodyTransformService) {
        var modelService = {}

        var threads = []
        var newThreads = []
        var posts = {}
        var employees = [
            'shacknews',
            'the man with the briefcase',
            'ozziemejia',
            'staymighty',
            'hammersuit',
            'gburke59',
            'daniel_perez',
            'sporkyreeve',
            'joshua hawkins',
            'steven wong',
            'squidwizard',
            'beardedaxe'
        ]

        modelService.updateAllThreads = function() {
            _.each(threads, updateExpiration)
        }

        modelService.addThread = function(post, event) {
            var thread = fixThread(post)
            if (event === true) {
                newThreads.push(thread)
            } else {
                threads.push(thread)
            }
            posts[thread.threadId] = thread
            return thread
        }

        modelService.getThreads = function() {
            return threads
        }

        modelService.getNewThreads = function() {
            return newThreads
        }

        modelService.addPost = function(post, thread) {
            if (!posts[post.id]) {
                thread = thread || posts[post.threadId]
                var parent = posts[post.parentId]
                if (parent && thread) {
                    var fixedPost = fixPost(post, thread)
                    updateLineClass(fixedPost, thread)
                    updateModTagClass(fixedPost)
                    fixedPost.parentAuthor = parent.author
                    fixedPost.depth = parent.depth + 1

                    thread.replyCount++

                    if (parent.id === thread.id) {
                        thread.posts.push(fixedPost)
                    } else {
                        var lastParentReply = findLastInChain(thread, parent.id, 0)
                        if (lastParentReply > 0) {
                            thread.posts.splice(lastParentReply + 1, 0, fixedPost)
                        } else {
                            var indexOfParent = _.indexOf(thread.posts, parent)
                            thread.posts.splice(indexOfParent + 1, 0, fixedPost)
                        }
                    }

                    //add to master post array
                    posts[fixedPost.id] = fixedPost

                    return {thread: thread, parent: parent, post: fixedPost}
                }
            }
        }

        function findLastInChain(thread, parentId, lastIndex) {
            var index = _.findLastIndex(thread.posts, { parentId: parentId })
            if (index > 0) {
                return findLastInChain(thread, thread.posts[index].id, index)
            }
            return lastIndex
        }

        modelService.getPost = function(id) {
            return posts[id]
        }

        modelService.getPostThread = function(post) {
            if (post.parentId > 0) {
                return modelService.getPost(post.threadId)
            } else {
                return post
            }
        }

        modelService.changeCategory = function(id, category) {
            var post = posts[id]
            if (post) {
                if (category === 'nuked') {
                    //remove if it's a root post
                    _.pull(threads, post)

                    //recursively remove all children
                    removePost(post)

                    //update reply count
                    countReplies(post)
                } else {
                    post.category = category
                    updateModTagClass(post)
                    $rootScope.$broadcast('post-category-change-' + post.id)
                }
            }
        }

        modelService.cleanCollapsed = function() {
            settingsService.cleanCollapsed(posts)
        }

        modelService.clear = function() {
            while (threads.length) {
                threads.pop()
            }
            posts = {}
        }

        function fixThread(thread) {
            var threadPosts = _.sortBy(thread.posts, 'id')

            //handle root post
            if (thread.posts) {
                var rootPost = _.find(threadPosts, {parentId: 0})
                _.pull(threadPosts, rootPost)
                thread.id = rootPost.id
                thread.threadId = rootPost.id
                thread.parentId = 0
                thread.depth = 0
                thread.author = rootPost.author
                thread.date = rootPost.date
                thread.category = rootPost.category
                thread.body = rootPost.body
            }
            thread.visible = true
            thread.lastPostId = thread.id
            thread.replyCount = 0
            thread.recent = []
            thread.posts = []
            posts[thread.id] = thread
            fixPost(thread)
            updateModTagClass(thread)
            updateExpiration(thread)

            while (threadPosts.length > 0) {
                var post = threadPosts.shift()
                modelService.addPost(post, thread)
            }

            //check if it's supposed to be collapsed
            if (settingsService.isCollapsed(thread.threadId)) {
                thread.state = 'collapsed'
                thread.visible = false
            } else if (thread.replyCount > 10) {
                thread.state = 'truncated'
            }

            return thread
        }

        function fixPost(post, thread) {
            //parse body for extra features
            post.body = bodyTransformService.parse(post)

            //add user class highlight
            if (post.author.toLowerCase() === settingsService.getUsername().toLowerCase()) {
                post.userClass = 'user_me'
            } else if (thread && post.author.toLowerCase() === thread.author.toLowerCase()) {
                post.userClass = 'user_op'
            } else if (_.contains(employees, post.author.toLowerCase())) {
                post.userClass = 'user_employee'
            }

            //add last action date
            if (thread) {
                thread.lastPostId = post.id
            }

            return post
        }

        function updateLineClass(post, thread) {
            thread.recent.push(post)

            if (thread.recent.length > 10) {
                var oldPost = thread.recent.shift()
                $rootScope.$broadcast('post-line-highlight-' + oldPost.id)
            }

            _.each(thread.recent, function(recentPost, index) {
                recentPost.lineClass = 'oneline' + (9 - index)
                $rootScope.$broadcast('post-line-highlight-' + recentPost.id)
            })
        }

        function updateModTagClass(post) {
            if (post.category === 'informative') {
                post.tagClass = 'postInformative'
            } else if (post.category === 'nws') {
                post.tagClass = 'postNws'
            } else if (post.author.toLowerCase() === 'shacknews') {
                post.tagClass = 'postFrontpage'
            } else {
                delete post.tagClass
            }
        }

        function updateExpiration(thread) {
            thread.expirePercent = Math.min(((((new Date().getTime()) - new Date(thread.date).getTime()) / 3600000) / 18) * 100, 100)
            if (thread.expirePercent <= 25) {
                thread.expireColor = 'springgreen'
            } else if (thread.expirePercent <= 50) {
                thread.expireColor = 'yellow'
            } else if (thread.expirePercent <= 75) {
                thread.expireColor = 'orange'
            } else {
                thread.expireColor = 'red'
            }
        }

        function removePost(post) {
            delete posts[post.id]
            _.each(post.posts, removePost)
        }

        function countReplies(post) {
            return _.reduce(post.posts, function(result, subreply) {
                return result + countReplies(subreply) + 1
            }, 0)
        }

        return modelService
    })
