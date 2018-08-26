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

    constructor(private sanitizer:DomSanitizationService) {
    }

    ngOnInit() {
        this.text = this.url
        this.url = this.sanitizer.bypassSecurityTrustUrl(this.text)

        if (this.type === 'comment') {
            this.resource = this.fixUrl('.+?chatty\\?id=(\\d+)(#item_(\\d+))?', '#/thread/$1/$3')
        } else if (this.type === 'image') {
            let tmp = this.testFixUrl([
                {
                    test: 'chattypics.com\\/viewer.php\\?file=',
                    regex: '(.+?chattypics.com\\/)(viewer.php\\?file=)?(files\\/)?(.+)',
                    replace: '$1files/$4'
                }
            ])
            this.resource = this.sanitizer.bypassSecurityTrustUrl(tmp)
        } else if (this.type === 'youtube') {
            let tmp = this.fixUrl('(.+?)\\.(com|be)(\\/|\\/watch\\?)(.+v=)?([^&]+)(.+)?', 'https://www.youtube.com/embed/$5?rel=0')
            this.resource = this.sanitizer.bypassSecurityTrustResourceUrl(tmp)
        } else if (this.type === 'vimeo') {
            let tmp = this.fixUrl('.+vimeo\\.com\\/(\\d+)', 'https://player.vimeo.com/video/$1')
            this.resource = this.sanitizer.bypassSecurityTrustResourceUrl(tmp)
        } else if (this.type === 'gfycat') {
            let tmp = this.fixUrl('(.+)\/(.+)', '$1/ifr/$2')
            this.resource = this.sanitizer.bypassSecurityTrustResourceUrl(tmp)
        }
    }

    toggleVisibility() {
        this.visible = !this.visible
    }

    fixUrl(regex, fixed) {
        let rex = new RegExp(regex)
        return this.text.replace(rex, fixed)
    }

    testFixUrl(tests) {
        let result = _.find(tests, test => {
            let rex = new RegExp(<any>test.test)
            return rex.test(this.text)
        })

        if (result) {
            return this.fixUrl(result.regex, result.replace)
        } else {
            return this.text
        }
    }
}
