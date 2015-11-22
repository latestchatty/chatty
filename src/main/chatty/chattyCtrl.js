module.exports = /* @ngInject */
    function($scope, modelService) {
        $scope.threads = modelService.getThreads()
        $scope.newThreads = modelService.getNewThreads()
    }
