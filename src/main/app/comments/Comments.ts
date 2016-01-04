import {Component, Input} from 'angular2/core'
import {ActionService} from '../services/ActionService'
import {TabService} from '../services/TabService'
import {ApiService} from "../services/ApiService";
import {Post} from '../post/Post'
import {ReplyBox} from '../replybox/ReplyBox'
import {ScrollIntoView} from '../directives/ScrollIntoView'

@Component({
    selector: 'comments',
    templateUrl: './app/comments/comments.html',
    providers: [ActionService, TabService, ApiService],
    directives: [Comments, Post, ReplyBox, ScrollIntoView]
})
export class Comments {
    @Input() public flat
    @Input() public posts

    constructor(private actionService:ActionService,
                private tabService:TabService,
                private apiService:ApiService) {
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
        //TODO: fix tabs
        //this.tabService.addTab('user', user)
    }
}
