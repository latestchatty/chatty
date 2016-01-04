module.exports = /* @ngInject */
    function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'thread/thread.html',
            /* @ngInject */
            controller: function($scope, actionService) {
                $scope.expandThread = function(thread) {
                    actionService.expandThread(thread)
                }
            }
        }
    }
