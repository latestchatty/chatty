declare var _:any
import {Component, Input, OnInit} from '@angular/core'
import {DomSanitizationService} from '@angular/platform-browser'

@Component({
    selector: 'embed-content',
    template: require('./embedContent.html')
})
export class EmbedContent implements OnInit {
    public visible = false
    public text
    public resource
    @Input() public url
    @Input() public type

    constructor(private sanitizer:DomSanitizationService) {}

    ngOnInit() {
        this.text = this.url
        this.url = this.sanitizer.bypassSecurityTrustUrl(this.text)
    }

    toggleVisibility() {
        this.visible = !this.visible
    }

    fixUrl(regex, fixed) {
        let rex = new RegExp(regex)
        let url = this.text.replace(rex, fixed)
        return this.sanitizer.bypassSecurityTrustResourceUrl(url)
    }

    testFixUrl(tests) {
        let result = _.find(tests, test => {
            let rex = new RegExp(<any>test.test)
            return rex.test(this.text)
        })

        if (result) {
            return this.fixUrl(result.regex, result.replace)
        } else {
            return this.sanitizer.bypassSecurityTrustResourceUrl(this.url)
        }
    }
}
