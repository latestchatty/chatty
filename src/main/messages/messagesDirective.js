angular.module('chatty')
    .directive('messages', function(shackMessageService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'messages/messages.html',
            controller: function($scope, shackMessageService) {
                $scope.messages = shackMessageService.getMessagesForCurrentPage;
                $scope.showMessages = shackMessageService.getMessagesShown;

                //TODO: Don't load messages until the user requested them to be shown.
                $scope.toggleShow = function() {
                    shackMessageService.toggleMessagesShown();
                };
            }
        };
    });