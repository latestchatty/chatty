angular.module('chatty')
    .controller('chattyCtrl', function($scope, $filter, chattyService) {
        //load full chatty on start
        $scope.threads = [];
        chattyService.fullLoad().then(function(threads) {
            $scope.threads = threads;
        });

        //support filters
        $scope.filterSet = false;
        $scope.filterExpression = null;
        $scope.$watch('filterExpression', function runFilter() {
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