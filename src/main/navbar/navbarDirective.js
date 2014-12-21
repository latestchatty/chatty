angular.module('chatty')
    .directive('navbar', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'navbar/navbar.html',
            controller: function($scope, $window, actionService, settingsService, tabService) {
                //login related
                $scope.loginRunning = false;
                $scope.loginInvalid = false;
                $scope.username = settingsService.getUsername();
                $scope.password = null;
                $scope.embedded = settingsService.isEmbeddedInShacknews();
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
                $scope.filterExpression = null;
                $scope.$watch('filterExpression', function runFilter() {
                    tabService.filterThreads($scope.filterExpression);
                });

                //support tabs
                $scope.tabs = tabService.getTabs();
                $scope.selectTab = function(tab) {
                    tabService.selectTab(tab);
                    $window.scrollTo(0, 0);
                };
                $scope.addTab = function(expression) {
                    return tabService.addTab({ $:expression }, expression);
                };
                $scope.removeTab = function(tab) {
                    tabService.removeTab(tab);
                };

                //new thread
                $scope.newThreadPost = { id: 0 };
                $scope.newThread = function newThread() {
                    actionService.openReplyBox($scope.newThreadPost);
                };

                //reflow
                $scope.reflowThreads = function reflowThreads() {
                    $window.scrollTo(0, 0);
                    actionService.reflowThreads();
                }
            }
        }
    });