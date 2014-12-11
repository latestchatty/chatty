angular.module('chatty')
    .directive('post', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'post/post.html',
            controller: function($scope, actionService) {
                $scope.collapse = function collapse(post) {
                    if (post.parentId) {
                        actionService.collapseReply(post);
                    } else {
                        actionService.collapseThread(post);
                    }
                };

                $scope.openReplyBox = function openReplyBox(post) {
                    actionService.openReplyBox(post);
                };
            }
        }
    });