angular.module('chatty')
    .controller('chattyCtrl', function($scope, $filter, chattyService) {
        $scope.threads = [];
        $scope.eventId = 0;
        $scope.error = null;
        $scope.filterSet = false;
        $scope.filterExpression = null;

        chattyService.fullLoad().then(function(threads) {
            $scope.threads = threads;
        });

        $scope.$watch('filterExpression', function() {
            $scope.filterSet = false;
            if ($scope.filterExpression) {
                _.forEach($scope.threads, function(thread) {
                    delete thread.visible;
                });

                var visibleThreads = $filter('filter')($scope.threads, $scope.filterExpression);
                visibleThreads.forEach(function(thread) {
                    thread.visible = true;
                });
                $scope.filterSet = true;
            }
        });
    });