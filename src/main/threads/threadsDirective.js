angular.module('chatty')
    .directive('threads', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'threads/threads.html',
            controller: function($scope, modelService, actionService) {
                //load full chatty on start
                $scope.threads = modelService.getThreads();
                $scope.newThreads = modelService.getNewThreads();
                $scope.loadingMessages = [
                    'Think before you post...',
                    'It gets you chicks!',
                    '<span style="color: red; font-weight: bold;"> * N U K E D *</span>'
                ];
                $scope.loadingMessage = _.sample($scope.loadingMessages);

                $scope.$on('ngRepeatFinished', function() {
                    $scope.isLoaded = true;
                });

                $scope.expandThread = function(thread) {
                    actionService.expandThread(thread);
                };
            }
        };
    });