angular.module('chatty')
    .directive('onFinishRender', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope) {
                if (scope.$last) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished')
                    })
                }
            }
        }
    })
