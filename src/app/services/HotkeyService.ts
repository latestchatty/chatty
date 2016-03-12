declare var _:any
import {Injectable} from 'angular2/core'
import {ActionService} from './ActionService'

@Injectable()
export class HotkeyService {
    private handler = _.throttle($event => this.handleEvent($event), 50)

    constructor(private actionService:ActionService) {
    }

    start() {
        //TODO re-enable hotkeys once they work in all browsers
        //document.body.addEventListener('keydown', this.handler)
    }

    stop() {
        //document.body.removeEventListener('keydown', this.handler)
    }

    private handleEvent(event) {
        if (event.defaultPrevented) return

        if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            //disable further processing
            event.preventDefault()

            if (event.keyCode === 65) {
                //a key for previous reply
                this.actionService.previousReply()
            } else if (event.keyCode === 90) {
                //z key for next reply
                this.actionService.nextReply()
            } else if (event.keyCode === 27) {
                //esc key for collapse current reply
                this.actionService.collapsePostReply(null)
            }
        }
    }
}
