declare var _:any
import {Injectable} from 'angular2/core'
import {ActionService} from './ActionService'

@Injectable()
export class HotkeyService {
    constructor(private actionService:ActionService) {
    }

    startListening() {
        document.body.addEventListener('keydown', $event => this.handleEvent($event))
    }

    private handleEvent(event) {
        if (event.srcElement.localName !== 'input' && event.srcElement.localName !== 'textarea') {
            _.throttle(() => {
                //don't handle modifier versions
                if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                    setTimeout(() => {
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
                    })
                }
            }, 10)()
        }
    }

}
