angular.module('chatty')
    .directive('post', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'post/post.html',
            controller: function($scope, actionService, tabService) {
                $scope.collapse = function collapse(post) {
                    if (post.parentId) {
                        actionService.collapsePostReply(post);
                    } else {
                        actionService.collapseThread(post);
                    }
                };

                $scope.openReplyBox = function openReplyBox(post) {
                    actionService.openReplyBox(post);
                };

                $scope.addUserTab = function(user) {
                    tabService.addTab({ author: user }, user, 'New replies in threads participated in by ' + user + '.');
                };

                $scope.addPostTab = function(post) {
                    tabService.addTab({ id: post.id }, 'post', 'New replies in this specific post.');
                };
            }
        }
    });