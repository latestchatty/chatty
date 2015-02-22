angular.module('chatty')
    .directive('threads', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'threads/threads.html',
            controller: function($scope, modelService, actionService, eventService) {
                //load full chatty on start
                $scope.threads = modelService.getThreads();
                $scope.newThreads = modelService.getNewThreads();
                $scope.isLoaded = eventService.getIsLoaded;

                $scope.expandThread = function(thread) {
                    actionService.expandThread(thread);
                };
            }
        };
    });