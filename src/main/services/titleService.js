angular.module('chatty').service('titleService',
    function($document, $timeout) {
        var titleService = {}
        var titleOwner
        var prefix = 'SPA Chatty'

        titleService.init = function(owner) {
            titleOwner = owner
            $document[0].addEventListener('visibilitychange', changed)
            $document[0].addEventListener('webkitvisibilitychange', changed)
            $document[0].addEventListener('msvisibilitychange', changed)

            titleService.updateTitle(0)
        }

        titleService.updateTitle = function(add) {
            $timeout(function() {
                titleService.count += add

                if (!titleService.visible && titleOwner && titleService.count > 0) {
                    titleOwner.title = prefix + ' (' + titleService.count + ')'
                } else {
                    titleOwner.title = prefix
                }
            })
        }

        titleService.count = 0

        titleService.visible = true

        function changed() {
            titleService.visible =
                !($document[0].hidden ||
                $document[0].webkitHidden ||
                $document[0].mozHidden ||
                $document[0].msHidden)

            if (titleService.visible) {
                titleService.count = 0
                titleService.updateTitle(0)
            }
        }

        return titleService
    })
