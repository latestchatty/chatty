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

                $scope.testFixUrl = function(tests) {
                    var result = _.find(tests, function(test) {
                        var rex = new RegExp(test.test)
                        return rex.test($scope.url)
                    })

                    if (result) {
                        return $scope.fixUrl(result.regex, result.replace)
                    } else {
                        return $scope.url
                    }
                }
            }
        }
    })
