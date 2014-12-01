angular.module('chatty')
    .directive('replybox', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'replybox/replybox.html',
            scope: {
                post: '='
            },
            controller: function($scope, chattyService) {
                $scope.replyBody = null;

                $scope.submitPost = function submitPost() {
                    var id = $scope.post.id;
                    chattyService.submitPost(id, $scope.replyBody)
                        .then(function(result) {
                            if (result) {
                                $scope.close();
                            }
                        });
                };

                $scope.close = function close() {
                    $scope.post.replying = false;
                }
            }
        }
    });