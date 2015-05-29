angular.module('chatty')
    .directive('embedContent', function ($sce) {
        return {
            restrict: 'E',
            templateUrl: 'embedContent/embedContent.html',
            scope: {
                url: '@',
                type: '@'
            },
            controller: function($scope) {
                $scope.toggleVisibility = function() {
                    $scope.visible = !$scope.visible;
                };

                $scope.fixYoutubeUrl = function() {
                    return $sce.trustAsResourceUrl('https://www.youtube.com/embed/FhJmwK6wkF4');
                };
            }
        }
    });
