import {Component} from '@angular/core'
import {OnInit} from '@angular/core'
import {ActionService} from '../services/ActionService'
import {EventService} from '../services/EventService'
import {ModelService} from '../services/ModelService'
import {Navbar} from '../navbar/Navbar'
import {Post} from '../post/Post'
import {Thread} from '../thread/Thread'
import {Toast} from '../toast/Toast'

import './body.scss';
import './chatty.scss';

@Component({
    template: require('./splitChatty.html'),
    directives: [Navbar, Post, Thread, Toast]
})
export class SplitChatty implements OnInit {
    public threads
    public newThreads
    public selectedPost

    constructor(private actionService:ActionService,
                private eventService:EventService,
                private modelService:ModelService) {
    }

    ngOnInit() {
        this.eventService.startActive()
        this.threads = this.modelService.getThreads()
        this.newThreads = this.modelService.getNewThreads()
        this.selectedPost = this.actionService.getSelectedPost()
    }

    selectPost(post) {
        this.actionService.selectPost(post)
    }
}
