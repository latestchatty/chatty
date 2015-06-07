angular.module('chatty')
    .directive('ngIfEvent', function($animate, document) {
        return {
            multiElement: true,
            transclude: 'element',
            priority: 600,
            terminal: true,
            restrict: 'A',
            $$tlb: true,
            scope: {
                ngIfEvent: '@',
                ngIfEventId: '&',
                ngIfEventExpr: '&'
            },
            link: function($scope, $element, $attr, ctrl, $transclude) {
                var block, childScope, previousElements

                var eventId = $scope.$eval($scope.ngIfEventId)
                $scope.$on($scope.ngIfEvent + eventId, evaluate)
                evaluate()

                function evaluate() {
                    var value = $scope.$eval($scope.ngIfEventExpr)
                    if (value) {
                        if (!childScope) {
                            $transclude(function(clone, newScope) {
                                childScope = newScope
                                clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ')
                                // Note: We only need the first/last node of the cloned nodes.
                                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                                // by a directive with templateUrl when its template arrives.
                                block = {
                                    clone: clone
                                }
                                $animate.enter(clone, $element.parent(), $element)
                            })
                        }
                    } else {
                        if (previousElements) {
                            previousElements.remove()
                            previousElements = null
                        }
                        if (childScope) {
                            childScope.$destroy()
                            childScope = null
                        }
                        if (block) {
                            previousElements = getBlockNodes(block.clone)
                            $animate.leave(previousElements).then(function() {
                                previousElements = null
                            })
                            block = null
                        }
                    }
                }
            }
        }

        function getBlockNodes(nodes) {
            var node = nodes[0]
            var endNode = nodes[nodes.length - 1]
            var blockNodes = [node]

            do {
                node = node.nextSibling
                if (!node) {
                    break
                }
                blockNodes.push(node)
            } while (node !== endNode)

            return angular.element(blockNodes)
        }
    })
