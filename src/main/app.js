angular.module('chatty', ['ngSanitize', 'RecursionHelper'],
    function($rootScopeProvider) {
        $rootScopeProvider.digestTtl(60);
    });