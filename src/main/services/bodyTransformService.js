angular.module('chatty')
    .service('bodyTransformService', function() {
        var bodyTransformService = {}

        bodyTransformService.parse = function(post) {
            var fixed = post.body

            //fix Shacknews posts with article links
            if (post.author === 'Shacknews') {
                fixed = fixed.replace('href="', 'href="http://www.shacknews.com')
            }

            //fix spoiler tags not being clickable
            fixed = fixed.replace(/onclick=[^>]+/gm, 'tabindex="1"')

            //embedded images
            fixed = fixed.replace(/<a[^<]+?href="([^"]+?\.(png|jpg|jpeg|gif))">[^<]+?<\/a>/gi,
                '<embed-content url="$1" type="image"></embed-content>')

            //embedded youtubest
            fixed = fixed.replace(/<a[^<]+?href="((https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be).+?)">[^<]+?<\/a>/gi,
                '<embed-content url="$1" type="youtube"></embed-content>')

            //imgur gifv
            fixed = fixed.replace(/<a[^<]+?href="([^"]+?\.(gifv))">[^<]+?<\/a>/gi,
                '<embed-content url="$1" type="gifv"></embed-content>')

            //gfycat
            fixed = fixed.replace(/<a[^<]+?href="([^"]+?gfycat\.com\/[^"]+?)">[^<]+?<\/a>/gi,
                '<embed-content url="$1" type="gfycat"></embed-content>')

            return fixed
        }

        bodyTransformService.getSnippet = function(body) {
            var stripped = body.replace(/<embed\-content url="([^"]+)" type="[^"]+"><\/embed\-content>/gi, '$1')
            stripped = stripped.replace(/(<(?!span)(?!\/span)[^>]+>| tabindex="1")/gm, ' ')
            return htmlSnippet(stripped, 106)
        }

        function htmlSnippet(input, maxLength) {
            var i = 0
            var len = 0
            var tag = false
            var char = false
            while (i < input.length && len < maxLength) {
                if (input[i] === '<') {
                    tag = true
                } else if (input[i] === '>') {
                    tag = false
                } else if (input[i] === '&') {
                    char = true
                } else if (input[i] === '' && char) {
                    char = false
                    len++
                } else if (!tag) {
                    len++
                }

                i++
            }

            var output = _.trim(input.slice(0, i))
            if (i < input.length || !output) {
                output += '...'
            }

            return output
        }

        return bodyTransformService
    })
