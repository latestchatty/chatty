angular.module('chatty')
    .directive('navbar', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'navbar/navbar.html',
            controller: function($scope, $filter, actionService, settingsService) {
                //login related
                $scope.loginRunning = false;
                $scope.loginInvalid = false;
                $scope.username = settingsService.getUsername();
                $scope.password = null;
                $scope.loggedIn = !!$scope.username;
                $scope.doLogin = function doLogin() {
                    $scope.loginRunning = true;
                    $scope.loggedIn = false;
                    $scope.loginInvalid = false;
                    actionService.login($scope.username, $scope.password)
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
                    actionService.logout();
                    $scope.loginRunning = false;
                    $scope.loginInvalid = false;
                    $scope.loggedIn = false;
                };

                //support filters
                $scope.filterSet = false;
                $scope.filterExpression = null;
                $scope.tabs = settingsService.getTabs();
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
                $scope.setFilter = function setFilter(text) {
                    $scope.filterExpression = text;
                };
                $scope.addTab = function addTab(filterText, displayText) {
                    settingsService.addTab({filterText:filterText, displayText:displayText});
                };
                $scope.removeTab = function removeTab(tab) {
                    settingsService.removeTab(tab);
                }
            }
        }
    });