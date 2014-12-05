angular.module('chatty')
    .directive('comments', function (RecursionHelper) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'comments/comments.html',
        scope: {
            posts: '='
        },
        compile: function(element) {
            return RecursionHelper.compile(element);
        },
        controller: function($scope, actionService) {
            $scope.expandReply = function expandReply(post) {
                actionService.expandReply(post);
            };

            $scope.collapseReply = function collapseReply(post) {
                actionService.collapseReply(post);
            };

            $scope.openReplyBox = function openReplyBox(post) {
                actionService.openReplyBox(post);
            }
        }
    }
});