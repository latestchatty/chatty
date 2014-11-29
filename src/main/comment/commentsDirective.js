angular.module('chatty')
    .directive('comments', function (RecursionHelper) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'comment/comments.html',
        scope: {
            posts: '='
        },
        compile: function(element) {
            return RecursionHelper.compile(element);
        }
    }
});