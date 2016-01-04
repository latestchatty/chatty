module.exports = /* @ngInject */
    function($document, $timeout) {
        var titleService = {}
        var prefix = 'SPA Chatty'
        titleService.count = 0
        titleService.clearOnReturn = false
        titleService.visible = true

        //initialize stuff
        $document[0].addEventListener('visibilitychange', changed)
        $document[0].addEventListener('webkitvisibilitychange', changed)
        $document[0].addEventListener('msvisibilitychange', changed)

        titleService.updateTitle = function(add) {
            $timeout(function() {
                titleService.count += add

                if (titleService.count > 0) {
                    $document.title = prefix + ' (' + titleService.count + ')'
                } else {
                    $document.title = prefix
                }
            })
        }

        function changed() {
            titleService.visible =
                !($document[0].hidden ||
                $document[0].webkitHidden ||
                $document[0].mozHidden ||
                $document[0].msHidden)

            if (titleService.visible && titleService.clearOnReturn) {
                titleService.count = 0
                titleService.updateTitle(0)
            }
        }

        return titleService
    }
