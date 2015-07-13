angular.module('chatty')
    .directive('comments', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'comments/comments.html',
            scope: {
                posts: '=',
                flat: '@'
            },
            controller: function($scope, actionService, tabService) {
                $scope.expandReply = function(post) {
                    actionService.expandReply(post)
                }

                $scope.collapseReply = function(post) {
                    actionService.collapsePostReply(post)
                }

                $scope.openReplyBox = function(post) {
                    actionService.openReplyBox(post)
                }

                $scope.addUserTab = function(user) {
                    tabService.addTab('user', user)
                }

                $scope.getDepthStyle = function(post, flat) {
                    if (flat === 'true') {
                        return {}
                    } else {
                        return {
                            'margin-left': ((post.depth - 1) * 16) + 'px'
                        }
                    }
                }
            }
        }
    })
