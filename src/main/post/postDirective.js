angular.module('chatty')
    .directive('post', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'post/post.html',
            controller: function($scope, actionService, tabService) {
                $scope.collapse = function(post) {
                    if (post.parentId) {
                        actionService.collapsePostReply(post)
                    } else {
                        actionService.collapseThread(post)
                    }
                }

                $scope.openReplyBox = function(post) {
                    actionService.openReplyBox(post)
                }

                $scope.addUserTab = function(user) {
                    tabService.addTab('user', user)
                }

                $scope.pinPost = function(post) {
                    actionService.togglePinThread(post)
                }
            }
        }
    })
