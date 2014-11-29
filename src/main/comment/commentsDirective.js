angular.module('chatty')
    .directive('comments', function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: 'comment/comments.html',
        scope: {
            posts: '='
        }
    }
});