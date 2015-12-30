import {Injectable} from 'angular2/core'
import {OnInit} from 'angular2/core'

@Injectable()
export class TitleService implements OnInit{
    private prefix = 'NG2 Chatty'
    private count = 0
    private passiveMode = false
    private visible = true

    ngOnInit() {
        //initialize stuff
        document[0].addEventListener('visibilitychange', this.changed)
        document[0].addEventListener('webkitvisibilitychange', this.changed)
        document[0].addEventListener('msvisibilitychange', this.changed)
    }

    setPassive() {
        this.passiveMode = true
    }

    updateTitle(add) {
        setTimeout(() =>{
            this.count += add

            if (this.count > 0) {
                document.title = this.prefix + ' (' + this.count + ')'
            } else {
                document.title = this.prefix
            }
        })
    }

    private changed() {
        this.visible =
            !(document[0].hidden ||
            document[0].webkitHidden ||
            document[0].mozHidden ||
            document[0].msHidden)

        if (this.visible && this.passiveMode) {
            this.count = 0
            this.updateTitle(0)
        }
    }
}
