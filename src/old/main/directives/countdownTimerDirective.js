module.exports = /* @ngInject */
    function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                function update() {
                    var width = scope.$eval('post.expirePercent')
                    var color = scope.$eval('post.expireColor')
                    attrs.$set('style', 'width: ' + width + '%; background-color: ' + color + ';')
                }

                //initial value
                update()

                //watch for changes
                $rootScope.$on('countdown-timer', update)
            }
        }
    }
