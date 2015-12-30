import {Component} from 'angular2/core'
import {ActionService} from '../services/ActionService'
import {TabService} from '../services/TabService'
import {ApiService} from "../services/ApiService";

@Component({
    selector: 'comments',
    templateUrl: './app/comments/comments.html',
    providers: [ActionService, TabService, ApiService],
    directives: [Comments],
    inputs: ['posts', 'flat']
})
export class Comments {

    public flat
    public posts
    constructor(private actionService:ActionService,
                private tabService:TabService,
                private apiService:ApiService) {
        apiService.getChatty().then(threads => {
            console.log('threads here ', threads.threads)
            this.posts = threads.threads
        })
    }

    expandReply(post) {
        this.actionService.expandReply(post)
    }

    collapseReply(post) {
        this.actionService.collapsePostReply(post)
    }

    openReplyBox(post) {
        this.actionService.openReplyBox(post)
    }

    addUserTab(user) {
        this.tabService.addTab('user', user)
    }
}