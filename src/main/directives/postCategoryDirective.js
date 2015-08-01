angular.module('chatty').directive('postCategory',
    function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                function update() {
                    var tagClass = scope.$eval('post.tagClass')
                    if (tagClass) {
                        //add new
                        element.addClass(tagClass)
                    }
                }

                //initial value
                update()

                //wait for changes without watches
                var postId = scope.$eval('post.id')
                scope.$on('post-category-change-' + postId, update)
            }
        }
    })
