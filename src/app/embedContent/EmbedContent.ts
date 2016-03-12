declare var _:any
import {Component, Input} from 'angular2/core'

@Component({
    selector: 'embed-content',
    template: require('./embedContent.html')
})
export class EmbedContent {
    public visible = false
    @Input() public url
    @Input() public type

    toggleVisibility() {
        this.visible = !this.visible
    }

    fixUrl(regex, fixed) {
        var rex = new RegExp(regex)
        return this.url.replace(rex, fixed)
    }

    testFixUrl(tests) {
        var result = _.find(tests, test => {
            var rex = new RegExp(<any>test.test)
            return rex.test(this.url)
        })

        if (result) {
            return this.fixUrl(result.regex, result.replace)
        } else {
            return this.url
        }
    }
}
