import {Component, Input} from '@angular/core'
import {ActionService} from '../services/ActionService'
import {TabService} from '../services/TabService'
import {ApiService} from '../services/ApiService'
import {Post} from '../post/Post'
import {ReplyBox} from '../replybox/ReplyBox'
import {ScrollIntoView} from '../directives/ScrollIntoView'

import './comments.scss';

@Component({
    selector: 'comments',
    template: require('./comments.html'),
    directives: [Comments, Post, ReplyBox, ScrollIntoView]
})
export class Comments {
    @Input() public flat = false
    @Input() public posts = []

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
        this.tabService.addTab('user', user)
    }
}
