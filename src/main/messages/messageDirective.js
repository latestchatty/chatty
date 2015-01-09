angular.module('chatty')
    .directive('message', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'messages/message.html',
            controller: function($scope) {
                //Nothing yet.
            }
        }
    });