module.exports = /* @ngInject */
    function() {
        return {
            restrict: 'E',
            templateUrl: 'chatty/chatty.html',
            controllerAs: 'chatty',
            controller: /* @ngInject */
                function(modelService) {
                    this.threads = modelService.getThreads()
                    this.newThreads = modelService.getNewThreads()
                }
        }
    }
