declare var _:any
import {Component} from 'angular2/core'

@Component({
    selector: 'embedContent',
    templateUrl: './embedContent.html',
    inputs: ['url', 'type']
})
export class EmbedContent {
    private visible = false
    private url
    private type

    toggleVisibility() {
        this.visible = !this.visible
    }

    fixUrl(regex, fixed) {
        var rex = new RegExp(regex)
        var fixedUrl = this.url.replace(rex, fixed)
        return fixedUrl
    }

    testFixUrl(tests) {
        var result = _.find(tests, function (test) {
            var rex = new RegExp(test.test)
            return rex.test(this.url)
        })

        if (result) {
            return this.fixUrl(result.regex, result.replace)
        } else {
            return this.url
        }
    }
}
