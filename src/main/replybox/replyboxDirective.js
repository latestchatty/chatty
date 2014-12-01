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
                $scope.submitPost = function submitPost() {

                }
            }
        }
    });