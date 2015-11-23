module.exports = /* @ngInject */
    function($log, $window, settingsService, apiService) {
        var shackMessageService = {}

        shackMessageService.clear = function() {
            shackMessageService.totalMessageCount = '...'
            shackMessageService.unreadMessageCount = '...'
        }
        shackMessageService.clear()

        shackMessageService.getTotalMessageCount = function() {
            return shackMessageService.totalMessageCount
        }

        shackMessageService.getUnreadMessageCount = function() {
            return shackMessageService.unreadMessageCount
        }

        shackMessageService.getMessages = function() {
            return apiService.getMessages(settingsService.getUsername(), settingsService.getPassword())
                .error(function(data) {
                    $log.error('Error while getting shack messages: ', data)
                    return []
                })
        }

        shackMessageService.refresh = function() {
            if (settingsService.isLoggedIn()) {
                var user = settingsService.getUsername()
                var pass = settingsService.getPassword()
                apiService.getTotalInboxCount(user, pass)
                    .then(function(response) {
                        shackMessageService.totalMessageCount = _.get(response, 'data.total')
                        shackMessageService.unreadMessageCount = _.get(response, 'data.unread')
                    })
                    .catch(function(response) {
                        $log.error('Error during shackmessage count update: ', response)
                        shackMessageService.totalMessageCount = -1
                        shackMessageService.unreadMessageCount = -1
                    })
            }
        }

        shackMessageService.goToInbox = function() {
            $window.open('https://www.shacknews.com/messages', '_blank')
        }

        return shackMessageService
    }
