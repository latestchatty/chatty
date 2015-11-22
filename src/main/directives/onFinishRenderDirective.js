module.exports = /* @ngInject */
    function($timeout) {
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
    }
