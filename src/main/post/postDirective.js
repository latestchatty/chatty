angular.module('chatty')
    .directive('post', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'post/post.html'
        }
    });