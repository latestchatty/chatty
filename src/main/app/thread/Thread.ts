import {Component, Input} from 'angular2/core'
import {ActionService} from '../services/ActionService'
import {Comments} from '../comments/Comments'
import {Post} from '../post/Post'

@Component({
    selector: 'thread',
    templateUrl: 'app/thread/thread.html',
    directives: [Comments, Post]
})
export class Thread {
    public post

    constructor(private actionService:ActionService){
    }

    @Input() set value(post) {
        this.post = post
    }

    expandThread() {
        this.actionService.expandThread(this.post)
    }
}
