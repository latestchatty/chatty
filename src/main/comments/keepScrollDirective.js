angular.module('chatty')
    .directive('keepScroll', function($window) {
        return {
            controller: function() {
                var element = 0;
                var lastHeight;

                this.setElement = function(el) {
                    element = el;
                };

                this.itemChanged = function(item) {
                    if ((item.offsetTop <= $window.scrollY + $window.innerHeight / 2) && $window.scrollY > 0) {
                        if (element.scrollHeight !== lastHeight) {
                            $window.scrollTo($window.scrollX, $window.scrollY + item.scrollHeight);
                        }
                    }

                    lastHeight = element.scrollHeight;
                };
            },
            link: {
                pre: function(scope, element, attr, ctrl) {
                    ctrl.setElement(element[0]);
                }
            }
        };
    });