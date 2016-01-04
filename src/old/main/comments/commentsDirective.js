module.exports = /* @ngInject */
    function(RecursionHelper) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'comments/comments.html',
            scope: {
                posts: '=',
                flat: '='
            },
            compile: function(element) {
                return RecursionHelper.compile(element)
            },
            /* @ngInject */
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
            }
        }
    }
