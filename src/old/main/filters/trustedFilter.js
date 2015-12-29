module.exports = /* @ngInject */
    function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text)
        }
    }
