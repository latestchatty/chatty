angular.module('chatty')
    .directive('keepScroll', function($window) {
        return {
            controller: function($scope) {
                $scope.element = 0
                $scope.lastHeight = null

                this.setElement = function(el) {
                    $scope.element = el

                    $scope.$watch('element.scrollHeight', function() {
                        $scope.lastHeight = $scope.element.scrollHeight
                    }, true)
                }

                this.itemChanged = function(item) {
                    if ((item.offsetTop <= $window.scrollY) && $window.scrollY > 0) {
                        if ($scope.element.scrollHeight !== $scope.lastHeight) {
                            var diff = $scope.element.scrollHeight - $scope.lastHeight
                            $window.scrollTo($window.scrollX, $window.scrollY + diff)
                        }
                    }

                    $scope.lastHeight = $scope.element.scrollHeight
                }
            },
            link: {
                pre: function(scope, element, attr, ctrl) {
                    ctrl.setElement(element[0])
                }
            }
        }
    })
