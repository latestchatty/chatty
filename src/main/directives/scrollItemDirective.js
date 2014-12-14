angular.module('chatty')
    .directive('scrollItem', function() {
        return {
            require: '^keepScroll',
            link: function(scope, element, attr, ctrl) {
                ctrl.itemChanged(element[0]);
            }
        };
    });