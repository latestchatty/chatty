import {Component} from 'angular2/core'
import {OnInit} from 'angular2/core'
import {ActionService} from '../services/ActionService'
import {EventService} from '../services/EventService'
import {ModelService} from '../services/ModelService'
import {Navbar} from '../navbar/Navbar'
import {Post} from '../post/Post'
import {Thread} from '../thread/Thread'
import {Toast} from '../toast/Toast'

@Component({
    templateUrl: 'app/chatty/simpleChatty.html',
    directives: [Navbar, Post, Thread, Toast]
})
export class SimpleChatty implements OnInit {
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
