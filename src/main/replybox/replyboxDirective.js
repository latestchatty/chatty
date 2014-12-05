angular.module('chatty')
    .directive('replybox', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'replybox/replybox.html',
            controller: function($scope, actionService) {
                $scope.replyBody = null;

                $scope.submitPost = function submitPost() {
                    actionService.submitPost($scope.post.id, $scope.replyBody);
                    $scope.close();
                };

                $scope.close = function close() {
                    $scope.post.replying = false;
                }
            }
        }
    });