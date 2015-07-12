angular.module('chatty').directive('postCategory',
    function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                function updateClass() {
                    //remove old
                    _.each(['postInformative', 'postNws', 'postFrontpage'], element.removeClass)

                    //add new
                    var tagClass = scope.$eval('post.tagClass')
                    element.addClass(tagClass)
                }

                //wait for changes without watches
                var postId = scope.$eval('post.id')
                scope.$on('post-category-change-' + postId, updateClass)
            }
        }
    })
