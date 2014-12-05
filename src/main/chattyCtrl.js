angular.module('chatty')
    .controller('chattyCtrl', function($scope, $filter, $document, $timeout, modelService, actionService, settingsService) {
        //load full chatty on start
        $scope.threads = modelService.getThreads();
        $scope.newThreads = modelService.getNewThreads();

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
            actionService.collapseThread(thread);
        };

        $scope.expandThread = function expandThread(thread) {
            actionService.expandThread(thread);
        };

        $scope.openReplyBox = function openReplyBox(thread) {
            actionService.openReplyBox(thread);
        };

        $scope.expandNewThreads = function expandNewThreads() {
            actionService.expandNewThreads();
        };

        //have to check for keystrokes globally
        $document.bind('keydown', function(event) {
            if (!event.repeat && event.srcElement.localName !== 'input'
                && event.srcElement.localName !== 'textarea') {
                $timeout(function() {
                    if (event.keyCode === 65) {
                        actionService.previousReply();
                    } else if (event.keyCode === 90) {
                        actionService.nextReply();
                    } else if (event.keyCode === 27) {
                        actionService.collapseReply();
                    }
                });
            }
        })

    });