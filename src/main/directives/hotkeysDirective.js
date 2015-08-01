angular.module('chatty')
    .directive('hotkeys', function() {
        return {
            restrict: 'A',
            controller: function($document, $timeout, actionService) {
                $document.bind('keydown', function(event) {
                    if (event.srcElement.localName !== 'input'
                        && event.srcElement.localName !== 'textarea') {

                        _.throttle(function() {
                            //don't handle modifier versions
                            if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                                $timeout(function() {
                                    if (event.keyCode === 65) {
                                        actionService.previousReply()
                                    } else if (event.keyCode === 90) {
                                        actionService.nextReply()
                                    } else if (event.keyCode === 27) {
                                        actionService.collapsePostReply()
                                    }
                                })
                            }
                        }, 10)()
                    }
                })
            }
        }
    })
