module.exports = /* @ngInject */
    function($rootScopeProvider) {
        //necessary to allow commentDirective to be recursive
        $rootScopeProvider.digestTtl(60)
    }
