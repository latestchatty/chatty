angular.module('chatty')
    .controller('chattyCtrl', function($scope, $filter, chattyService) {
        //load full chatty on start
        $scope.threads = [];
        chattyService.fullLoad().then(function(threads) {
            $scope.threads = threads;
        });

        //login related
        $scope.loginRunning = false;
        $scope.loginInvalid = false;
        $scope.username = chattyService.getUsername();
        $scope.password = null;
        $scope.loggedIn = !!$scope.username;
        $scope.doLogin = function doLogin() {
            $scope.loginRunning = true;
            $scope.loggedIn = false;
            $scope.loginInvalid = false;
            chattyService.login($scope.username, $scope.password)
                .then(function(result) {
                    if (result) {
                        $scope.loggedIn = true;
                    } else {
                        $scope.loginInvalid = true;
                    }
                    $scope.password = null;
                    $scope.loginRunning = false;
                });
        };
        $scope.doLogout = function doLogout() {
            $scope.username = null;
            $scope.password = null;
            chattyService.logout();
            $scope.loginRunning = false;
            $scope.loginInvalid = false;
            $scope.loggedIn = false;
        };

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

        $scope.collapseThread = function collapseThread(thread) {
            chattyService.collapseThread(thread);
        };

        $scope.expandThread = function expandThread(thread) {
            chattyService.expandThread(thread);
        };

        $scope.openReplyBox = function openReplyBox(thread) {
            chattyService.openReplyBox(thread);
        };
    });