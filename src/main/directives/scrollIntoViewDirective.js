module.exports = /* @ngInject */
    function($timeout, $window) {
        return {
            link: {
                post: function postLink(scope, element) {
                    $timeout(function() {
                        if ($window.scrollY + $window.innerHeight < element[0].offsetTop + element[0].scrollHeight) {
                            element[0].scrollIntoView(false)
                        }
                    })
                }
            }
        }
    }
