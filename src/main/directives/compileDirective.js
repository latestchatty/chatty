angular.module('chatty')
    .directive('compile', function ($compile) {
        return {
            restrict: 'A',
            scope: {
                compile: '='
            },
            link: function (scope, element) {
                element.html(scope.compile);
                $compile(element.contents())(scope);
            }
        }
    });
