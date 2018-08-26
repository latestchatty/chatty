declare var _ : any
import {Injectable} from '@angular/core'
import {DomSanitizationService} from '@angular/platform-browser'

@Injectable()
export class BodyTransformService {
    private matchers = [
        {regex: /<a[^<]+?href="([^"]+?\.(png|jpg|jpeg|gif))">[^<]+?<\/a>/gi, type: 'image'},
        {regex: /<a[^<]+?href="((https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be).+?)">[^<]+?<\/a>/gi, type: 'youtube'},
        {regex: /<a[^<]+?href="((https?:\/\/)?(www\.|m\.)?vimeo\.com\/.+?)">[^<]+?<\/a>/gi, type: 'vimeo'},
        {regex: /<a[^<]+?href="([^"]+?gfycat\.com\/[^"]+?)">[^<]+?<\/a>/gi, type: 'gfycat'},
        {regex: /<a[^<]+?href="((https?:\/\/)?(www\.)?(shacknews\.com)\/chatty\?id=(\d+)(#item_(\d+))?.*?)">[^<]+?<\/a>/gi, type: 'comment'}
    ]

    constructor(private sanitizer: DomSanitizationService) {}

    parse(post) {
        var fixed = post.body

        //fix Shacknews posts with article links
        if (post.author === 'Shacknews') {
            fixed = fixed.replace('href="', 'href="http://www.shacknews.com')
        }

        //fix spoiler tags not being clickable
        fixed = fixed.replace(/onclick=[^>]+/gm, 'tabindex="1"')

        //find matching urls for embeds
        var matches = []
        _.each(this.matchers, matcher => {
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
            _.each(_.uniq(_.sortBy(matches, 'index'), 'index'), match => {
                //static html prior to this chunk
                let chunk = this.sanitizer.bypassSecurityTrustHtml(fixed.slice(index, match.index))
                chunks.push(chunk)

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
                let chunk = this.sanitizer.bypassSecurityTrustHtml(fixed.slice(index))
                chunks.push(chunk)
            }
        } else {
            let chunk = this.sanitizer.bypassSecurityTrustHtml(fixed)
            chunks.push(chunk)
        }

        return {
            chunks: chunks,
            oneline: this.getSnippet(fixed)
        }
    }

    getSnippet(body) {
        let stripped = body.replace(/<embed\-content url="([^"]+)" type="[^"]+"><\/embed\-content>/gi, '$1')
        stripped = stripped.replace(/(<(?!span)(?!\/span)[^>]+>| tabindex="1")/gm, ' ')
        stripped = this.htmlSnippet(stripped, 106)
        return this.sanitizer.bypassSecurityTrustHtml(stripped)
    }

    private htmlSnippet(input, maxLength) {
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
}
