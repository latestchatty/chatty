angular.module('chatty')
    .service('bodyTransformService', function () {
        var bodyTransformService = {};

        bodyTransformService.parse = function(post) {
            var fixed = post.body;

            //fix Shacknews posts with article links
            if (post.author === 'Shacknews') {
                fixed = fixed.replace('href="', 'href="http://www.shacknews.com');
            }

            //fix spoiler tags not being clickable
            fixed = fixed.replace(/onclick=[^>]+/gm, 'tabindex="1"');

            return fixed;
        };

        bodyTransformService.getSnippet = function(body) {
            var stripped = body.replace(/(<(?!span)(?!\/span)[^>]+>| tabindex="1")/gm, ' ');
            return htmlSnippet(stripped, 106);
        };

        function htmlSnippet(input, maxLength) {
            var i = 0;
            var len = 0;
            var tag = false;
            var char = false;
            while (i < input.length && len < maxLength) {
                if (input[i] === '<') {
                    tag = true;
                } else if (input[i] === '>') {
                    tag = false;
                } else if (input[i] === '&') {
                    char = true;
                } else if (input[i] === ';' && char) {
                    char = false;
                    len++;
                } else if (!tag) {
                    len++;
                }

                i++;
            }

            var output = input.slice(0, i);
            if (i < input.length) {
                output += '...';
            }
            return output;
        }

        return bodyTransformService;
    });
