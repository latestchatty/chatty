angular.module('chatty')
    .service('shackMessageService', function($window, settingsService, apiService) {
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
                    console.log('Error while getting shack messages: ', data)
                    return []
                })
        }

        shackMessageService.refresh = function() {
            if (settingsService.isLoggedIn()) {
                apiService.getTotalInboxCount(settingsService.getUsername(), settingsService.getPassword())
                    .success(function(data) {
                        shackMessageService.totalMessageCount = data.total
                        shackMessageService.unreadMessageCount = data.unread
                    })
                    .error(function(data) {
                        console.log('Error during shackmessage count update: ', data)
                        shackMessageService.totalMessageCount = -1
                        shackMessageService.unreadMessageCount = -1
                    })
            }
        }

        shackMessageService.goToInbox = function() {
            $window.open('https://www.shacknews.com/messages', '_blank')
        }

        return shackMessageService
    })
