module.exports = /* @ngInject */
    function() {
        return {
            require: '^keepScroll',
            link: function(scope, element, attr, ctrl) {
                ctrl.itemChanged(element[0])
            }
        }
    }
