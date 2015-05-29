angular.module('chatty')
    .directive('embedContent', function () {
        return {
            restrict: 'E',
            templateUrl: 'embedContent/embedContent.html',
            scope: {
                url: '@'
            },
            controller: function($scope) {
                $scope.toggleVisibility = function() {
                    $scope.visible = !$scope.visible;
                }
            }
        }
    });
