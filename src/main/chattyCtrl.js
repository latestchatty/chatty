angular.module('chatty')
    .controller('chattyCtrl', function($scope, $window, modelService, actionService) {
        //load full chatty on start
        $scope.threads = modelService.getThreads();
        $scope.newThreads = modelService.getNewThreads();

        $scope.expandNewThreads = function expandNewThreads() {
            var newThreads = modelService.getNewThreads();
            var threads = modelService.getThreads();

            while (newThreads.length) {
                threads.unshift(newThreads.pop());
            }
        };

        $scope.openReplyBox = function openReplyBox(thread) {
            actionService.openReplyBox(thread);
        };

        $scope.collapseThread = function collapseThread(thread) {
            actionService.collapseThread(thread);
        };

        $scope.expandThread = function expandThread(thread) {
            actionService.expandThread(thread);
        };
    });