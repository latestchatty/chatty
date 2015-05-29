angular.module('chatty')
    .directive('embedContent', function () {
        return {
            restrict: 'E',
            templateUrl: 'embedContent/embedContent.html',
            link: function (scope, element, attrs) {
                scope.url = attrs.url;
                
                scope.toggleVisibility = function() {
                    scope.visible = !scope.visible;
                }
            }
        }
    });
