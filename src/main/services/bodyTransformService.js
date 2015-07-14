angular.module('chatty')
    .service('bodyTransformService', function() {
        var bodyTransformService = {}

        var matchers = [
            {regex: /<a[^<]+?href="([^"]+?\.(png|jpg|jpeg|gif))">[^<]+?<\/a>/gi, type: 'image'},
            {regex: /<a[^<]+?href="((https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be).+?)">[^<]+?<\/a>/gi, type: 'youtube'},
            {regex: /<a[^<]+?href="((https?:\/\/)?(www\.|m\.)?vimeo\.com\/.+?)">[^<]+?<\/a>/gi, type: 'vimeo'},
            {regex: /<a[^<]+?href="((https?:\/\/)?([A-Za-z]+\.)?(imgur\.com).+?)">[^<]+?<\/a>/gi, type: 'imgur'},
            {regex: /<a[^<]+?href="([^"]+?gfycat\.com\/[^"]+?)">[^<]+?<\/a>/gi, type: 'gfycat'},
            {regex: /<a[^<]+?href="((https?:\/\/)?(www\.)?(shacknews\.com)\/chatty\?id=(\d+)(#item_(\d+))?.*?)">[^<]+?<\/a>/gi, type: 'comment'}
        ]

        bodyTransformService.parse = function(post) {
            var fixed = post.body

            //fix Shacknews posts with article links
            if (post.author === 'Shacknews') {
                fixed = fixed.replace('href="', 'href="http://www.shacknews.com')
            }

            //fix spoiler tags not being clickable
            fixed = fixed.replace(/onclick=[^>]+/gm, 'tabindex="1"')

            //find matching urls for embeds
            var matches = []
            _.each(matchers, function(matcher) {
                var result
                while ((result = matcher.regex.exec(fixed)) !== null) {
                    result.type = matcher.type
                    matches.push(result)
                }
            })

            //split html into chunks for rendering
            var chunks = []
            if (matches.length) {
                var index = 0
                _.each(_.uniq(_.sortBy(matches, 'index'), 'index'), function(match) {
                    //static html prior to this chunk
                    chunks.push(fixed.slice(index, match.index))

                    //matching chunk
                    chunks.push({
                        value: match[1],
                        type: 'embed',
                        embedType: match.type
                    })

                    index = match.index + match[0].length
                })

                //final static chunk
                if (index < fixed.length) {
                    chunks.push(fixed.slice(index))
                }
            } else {
                chunks.push(fixed)
            }

            return {
                chunks: chunks,
                oneline: bodyTransformService.getSnippet(fixed)
            }
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
