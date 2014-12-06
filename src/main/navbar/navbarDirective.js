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
                $scope.$watch('filterExpression', function runFilter() {
                    applyFilter($scope.filterExpression);
                });
                function applyFilter(filterExpression) {
                    $scope.filterSet = false;
                    if (filterExpression) {
                        _.forEach($scope.threads, function(thread) {
                            delete thread.visible;
                        });

                        var visibleThreads = $filter('filter')($scope.threads, filterExpression);
                        visibleThreads.forEach(function(thread) {
                            thread.visible = true;
                        });
                        $scope.filterSet = true;
                    }
                }

                //support tabs
                $scope.defaultTabs = [
                    { displayText: 'Chatty', filterExpression: null, selected: true },
                    { displayText: 'Frontpage', filterExpression: { author: 'Shacknews'} },
                    { displayText: 'Mine', filterExpression: settingsService.getUsername() }
                ];
                $scope.selectedTab = $scope.defaultTabs[0];
                $scope.tabs = settingsService.getTabs();
                $scope.selectTab = function selectTab(tab) {
                    delete $scope.selectedTab.selected;
                    $scope.filterExpression = null;
                    $scope.selectedTab = tab;
                    tab.selected = true;
                    applyFilter(tab.filterExpression);
                };
                $scope.addTab = function addTab(filterExpression, displayText) {
                    var tab = {filterExpression:filterExpression, displayText:displayText};
                    settingsService.addTab(tab);
                    return tab;
                };
                $scope.removeTab = function removeTab(tab) {
                    settingsService.removeTab(tab);
                }
            }
        }
    });