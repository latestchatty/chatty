angular.module('chatty').directive('lineHighlight',
    function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                function update() {
                    //remove old classes
                    _.each(_.range(0, 9), function(i) {
                        element.removeClass('oneline' + i)
                    })

                    //add new one
                    var lineClass = scope.$eval('post.lineClass')
                    element.addClass(lineClass)
                }

                //initial value
                update()

                //watch for changes
                var postId = scope.$eval('post.id')
                $rootScope.$on('post-line-highlight-' + postId, update)
            }
        }
    })
