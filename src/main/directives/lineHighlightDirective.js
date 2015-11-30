var _ = require('lodash')

module.exports = /* @ngInject */
    function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                function add() {
                    var lineClass = scope.$eval('post.lineClass')
                    element.addClass(lineClass)
                }

                function update() {
                    //remove old classes
                    _.each(_.range(0, 9), i => element.removeClass(`oneline${i}`))

                    add()
                }

                //initial value
                add()

                //watch for changes
                var postId = scope.$eval('post.id')
                $rootScope.$on(`post-line-highlight-${postId}`, update)
            }
        }
    }
