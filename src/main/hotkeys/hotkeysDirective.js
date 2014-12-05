angular.module('chatty')
    .directive('hotkeys', function () {
        return {
            restrict: 'A',
            controller: function($document, $timeout, actionService) {
                $document.bind('keydown', function(event) {
                    if (!event.repeat
                        && event.srcElement.localName !== 'input'
                        && event.srcElement.localName !== 'textarea') {

                        $timeout(function() {
                            if (event.keyCode === 65) {
                                actionService.previousReply();
                            } else if (event.keyCode === 90) {
                                actionService.nextReply();
                            } else if (event.keyCode === 27) {
                                actionService.collapseReply();
                            }
                        });
                    }
                });
            }
        }
    });