angular.module('chatty')
    .directive('threads', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'threads/threads.html',
            controller: function($scope, modelService, actionService) {
                //load full chatty on start
                $scope.threads = modelService.getThreads();
                $scope.newThreads = modelService.getNewThreads();

                $scope.expandThread = function expandThread(thread) {
                    actionService.expandThread(thread);
                };
            }
        };
    });