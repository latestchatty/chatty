var _ = require('lodash')

module.exports = /* @ngInject */
    function($log, $q, $timeout, apiService, settingsService) {
        var postService = {}

        var posting = false
        var lastTimeout = null
        var postQueue = []

        postService.getQueue = function() {
            return postQueue
        }

        postService.clearQueue = function() {
            $timeout.cancel(lastTimeout)
            posting = false

            while (postQueue.length) {
                postQueue.pop()
            }
        }

        postService.submitPost = function(parentId, body) {
            postQueue.push({parentId: parentId, body: body})

            if (!posting) {
                $timeout(startPosting)
            }
        }

        function postToApi(post) {
            var user = settingsService.getUsername()
            var pass = settingsService.getPassword()
            return apiService.submitPost(user, pass, post.parentId, post.body)
                .then(function(response) {
                    var result = _.get(response, 'data.result')
                    if (result !== 'success') {
                        $q.reject(response)
                    }
                })
        }

        function startPosting() {
            if (settingsService.isLoggedIn() && postQueue.length) {
                posting = true

                var post = postQueue[0]
                postToApi(post)
                    .then(function() {
                        _.pull(postQueue, post)
                        startPosting()
                    })
                    .catch(function(data) {
                        if (data && data.error && data.code === 'ERR_INVALID_LOGIN') {
                            settingsService.clearCredentials()
                            postService.clearQueue()
                        } else if (_.get(data, 'error') && _.contains(['ERR_BANNED', 'ERR_NUKED', 'ERR_SERVER'], data.code)) {
                            $log.error('Error creating post.', data)
                            _.pull(postQueue, post)
                        } else {
                            lastTimeout = $timeout(startPosting, 60000)
                        }
                    })
            } else {
                posting = false
            }
        }

        return postService
    }
