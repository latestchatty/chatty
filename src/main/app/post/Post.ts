import {Component, Input} from 'angular2/core'
import {ActionService} from '../services/ActionService'
import {TabService} from '../services/TabService'

@Component({
    selector: 'post',
    templateUrl: 'app/post/post.html',
    directives: []
})
export class Post {
    @Input() public post

    constructor(private actionService:ActionService,
                private tabService:TabService) {
    }

    collapse() {
        if (this.post.parentId) {
            this.actionService.collapsePostReply(this.post)
        } else {
            this.actionService.collapseThread(this.post)
        }
    }

    openReplyBox(post) {
        this.actionService.openReplyBox(post)
    }

    addUserTab(user) {
        //TODO fix tabs
        //this.tabService.addTab('user', user)
    }

    pinPost() {
        this.actionService.togglePinThread(this.post)
    }
}
