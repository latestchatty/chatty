angular.module('chatty')
    .directive('autoFocus', function() {
        return {
            link: {
                post: function(scope, element) {
                    element[0].focus()
                }
            }
        }
    })
