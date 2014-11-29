angular.module('chatty')
    .directive('comment', function($compile) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'comment/comment.html',
            controller: 'commentCtrl',
            scope: {
                post: '='
            },
            link: function (scope, element) {
                var commentsHtml = "<comments posts=\"post.posts\"></comments>";
                $compile(commentsHtml)(scope, function(cloned)   {
                    element.append(cloned);
                });
            }
        }
    });