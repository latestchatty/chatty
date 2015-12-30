module.exports = /* @ngInject */
    function() {
        return {
            link: {
                post: function(scope, element) {
                    element[0].focus()
                }
            }
        }
    }
