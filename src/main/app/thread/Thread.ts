import {Component, Input} from 'angular2/core'
import {ActionService} from '../services/ActionService'
import {Comments} from '../comments/Comments'
import {Post} from '../post/Post'
import {ReplyBox} from '../replybox/ReplyBox'

@Component({
    selector: 'thread',
    templateUrl: 'app/thread/thread.html',
    directives: [Comments, Post, ReplyBox]
})
export class Thread {
    @Input() public post
    @Input() public alwaysExpanded

    constructor(private actionService:ActionService) {
    }

    expandThread() {
        this.actionService.expandThread(this.post)
    }
}
