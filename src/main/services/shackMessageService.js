angular.module('chatty')
    .service('shackMessageService', function($window, settingsService, apiService) {
        var shackMessageService = {};

        shackMessageService.clear = function() {
            shackMessageService.totalMessageCount = '...';
            shackMessageService.unreadMessageCount = '...';
            shackMessageService.currentPageMessages = [];
            shackMessageService.messagesShown = false;
        };

        shackMessageService.clear();

        shackMessageService.getTotalMessageCount = function() {
            return shackMessageService.totalMessageCount;
        };

        shackMessageService.getUnreadMessageCount = function() {
            return shackMessageService.unreadMessageCount;
        };

        shackMessageService.getMessagesForCurrentPage = function () {
            return shackMessageService.currentPageMessages;
        };

        shackMessageService.getMessagesShown = function () {
            return shackMessageService.messagesShown;
        };

        shackMessageService.refresh = function() {
            if (settingsService.isLoggedIn()) {
                apiService.getTotalInboxCount(settingsService.getUsername(), settingsService.getPassword())
                    .success(function(data) {
                        shackMessageService.totalMessageCount = data.total;
                        shackMessageService.unreadMessageCount = data.unread;
                    })
                    .error(function(data) {
                        console.log('Error during shackmessage count update: ', data);
                        shackMessageService.totalMessageCount = -1;
                        shackMessageService.unreadMessageCount = -1;
                    });
                shackMessageService.setCurrentPage(1);
            }
        };

        shackMessageService.toggleMessagesShown = function () {
          shackMessageService.messagesShown = !shackMessageService.messagesShown;
        };

        shackMessageService.setCurrentPage = function (page) {
            if (settingsService.isLoggedIn()) {
                apiService.getMessages(page, settingsService.getUsername(), settingsService.getPassword())
                    .success(function(data) {
                        shackMessageService.currentPageMessages = data.messages;
                    })
                    .error(function(data) {
                        console.log('Error during shackmessage update: ', data);
                        shackMessageService.currentPageMessages = [];
                    });
            }
        };

        shackMessageService.goToInbox = function() {
            $window.open('https://www.shacknews.com/messages', '_blank');
        };

        return shackMessageService;
    });