angular.module('chatty')
    .directive('navbar', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'navbar/navbar.html',
            controller: function($scope, $window, actionService, postService, settingsService, tabService, shackMessageService) {
                //login related
                $scope.loginRunning = false;
                $scope.loginInvalid = false;
                $scope.username = settingsService.getUsername();
                $scope.password = null;
                $scope.embedded = settingsService.isEmbeddedInShacknews();
                $scope.loggedIn = settingsService.isLoggedIn;
                $scope.getTotalMessageCount = shackMessageService.getTotalMessageCount;
                $scope.getUnreadMessageCount = shackMessageService.getUnreadMessageCount;
                
                $scope.doLogin = function() {
                    $scope.loginRunning = true;
                    $scope.loginInvalid = false;
                    actionService.login($scope.username, $scope.password)
                        .then(function(result) {
                            if (!result) {
                                $scope.loginInvalid = true;
                            }
                            $scope.password = null;
                            $scope.loginRunning = false;
                        });
                };
                $scope.doLogout = function() {
                    postService.clearQueue();
                    $scope.username = null;
                    $scope.password = null;
                    actionService.logout();
                    $scope.loginRunning = false;
                    $scope.loginInvalid = false;
                };
                
                //post queue stuff
                $scope.postQueue = postService.getQueue();
                $scope.clearPostQueue = function() {
                    postService.clearQueue();
                };

                //support filters
                $scope.filterExpression = null;
                $scope.$watch('filterExpression', function() {
                    tabService.filterThreads($scope.filterExpression);
                });

                //support tabs
                $scope.tabs = tabService.getTabs();
                $scope.selectTab = function(tab) {
                    tabService.selectTab(tab);
                    $window.scrollTo(0, 0);
                    $scope.filterExpression = null;
                };
                $scope.addTab = function(expression) {
                    return tabService.addTab('filter', expression);
                };
                $scope.removeTab = function(tab) {
                    tabService.removeTab(tab);
                };

                //new thread
                $scope.newThreadPost = { id: 0 };
                $scope.newThread = function() {
                    actionService.openReplyBox($scope.newThreadPost);
                };

                //reflow
                $scope.reflowThreads = function() {
                    $window.scrollTo(0, 0);
                    tabService.selectTab($scope.tabs[0]);
                    actionService.reflowThreads();
                    $scope.filterExpression = null;
                }
                
                $scope.goToInbox = shackMessageService.goToInbox;
            }
        }
    });