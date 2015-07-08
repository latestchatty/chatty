angular.module('chatty')
    .controller('chattyCtrl', function($scope, modelService) {
        $scope.threads = modelService.getThreads()
        $scope.newThreads = modelService.getNewThreads()
    })
