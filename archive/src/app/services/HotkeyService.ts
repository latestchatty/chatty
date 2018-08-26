declare var _:any
import {Injectable} from '@angular/core'
import {ActionService} from './ActionService'

@Injectable()
export class HotkeyService {
    private handler = _.throttle($event => this.handleEvent($event), 50)

    constructor(private actionService:ActionService) {
    }

    start() {
        document.body.addEventListener('keydown', this.handler)
    }

    stop() {
        document.body.removeEventListener('keydown', this.handler)
    }

    private handleEvent(event) {
        if (event.defaultPrevented) return
        
        if (event.keyCode === 65) {
            //a key for previous reply
            event.preventDefault()
            this.actionService.previousReply()
        } else if (event.keyCode === 90) {
            //z key for next reply
            event.preventDefault()
            this.actionService.nextReply()
        } else if (event.keyCode === 27) {
            event.preventDefault()
            //esc key for collapse current reply
            this.actionService.collapsePostReply(null)
        }
    }
}
