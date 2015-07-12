angular.module('chatty').directive('lineHighlight',
    function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                var unwatch = scope.$watch('post.lineClass', function(lineClass) {
                    //remove old classes
                    _.each(_.range(0,9), function(i) {
                        element.removeClass('oneline' + i)
                    })

                    //add new one
                    element.addClass(lineClass)

                    //stop watching when it's maxed
                    if (lineClass === 'oneline9') {
                        unwatch()
                    }
                })
            }
        }
    })
