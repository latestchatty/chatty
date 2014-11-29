angular.module('chatty')
    .controller('chattyCtrl', function($scope, $window, $document, chattyService) {
        $scope.threads = [];
        $scope.eventId = 0;
        $scope.error = null;

        chattyService.fullLoad().then(function(threads) {
            $scope.threads = threads;
        });

        $document.bind('scroll', _.debounce(function () {
            if (($window.pageYOffset + $window.innerHeight) / $window.document.body.scrollHeight >= 0.75) {
                $scope.$apply(chattyService.loadMore());
            }
        }, 250, { maxWait: 1000}));
    });