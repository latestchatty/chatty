angular.module('chatty')
    .directive('thread', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'thread/thread.html',
            controller: function($scope, actionService) {
                $scope.expandThread = function(thread) {
                    actionService.expandThread(thread)
                }
            }
        }
    })
