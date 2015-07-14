angular.module('chatty').controller('messagesCtrl',
    function($scope, shackMessageService, bodyTransformService) {
        function processMessage(message) {
            return {
                id: message.id,
                author: message.from,
                body: bodyTransformService.parse(message),
                type: 'shackmessage'
            }
        }

        //messages controller
        shackMessageService.getMessages()
            .then(function(response) {
                $scope.messages = _.map(response.data.messages, processMessage)
            })
    })
