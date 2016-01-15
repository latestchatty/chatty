import {Component} from 'angular2/core'
import {OnInit} from 'angular2/core'
import {ModelService} from '../services/ModelService'
import {Thread} from '../thread/Thread'
import {Navbar} from '../navbar/Navbar'
import {EventService} from '../services/EventService'
import {Toast} from '../toast/Toast'

@Component({
    templateUrl: 'app/chatty/chatty.html',
    directives: [Navbar, Thread, Toast]
})
export class Chatty implements OnInit {
    public threads
    public newThreads

    constructor(private eventService:EventService,
                private modelService:ModelService) {
    }

    ngOnInit() {
        this.eventService.startActive()
        this.threads = this.modelService.getThreads()
        this.newThreads = this.modelService.getNewThreads()
    }
}
