angular.module('chatty')
    .directive('embedContent', function($sce) {
        return {
            restrict: 'E',
            templateUrl: 'embedContent/embedContent.html',
            scope: {
                url: '@',
                type: '@'
            },
            controller: function($scope) {
                $scope.toggleVisibility = function() {
                    $scope.visible = !$scope.visible
                }

                $scope.fixUrl = function(regex, fixed) {
                    var rex = new RegExp(regex)
                    var url = $scope.url.replace(rex, fixed)
                    return $sce.trustAsResourceUrl(url)
                }
            }
        }
    })
