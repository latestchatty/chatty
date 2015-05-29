angular.module('chatty')
    .directive('compile', function ($compile) {
        return function (scope, element, attrs) {
            var unwatch = scope.$watch(
                function (scope) {
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                    unwatch();
                }
            );
        };
    });
