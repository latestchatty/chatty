angular.module('chatty')
    .directive('comments', function (RecursionHelper) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'comment/comments.html',
        scope: {
            posts: '=',
            loggedIn: '='
        },
        compile: function(element) {
            return RecursionHelper.compile(element);
        },
        controller: function($scope, chattyService) {
            $scope.expandReply = function expandReply(post) {
                chattyService.expandReply(post);
            };

            $scope.collapseReply = function collapseReply(post) {
                chattyService.collapseReply(post);
            };

            $scope.openReplyBox = function openReplyBox(post) {
                chattyService.openReplyBox(post);
            }
        }
    }
});