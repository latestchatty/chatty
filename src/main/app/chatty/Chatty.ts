import {Component} from 'angular2/core'
import {OnInit} from 'angular2/core'
import {ModelService} from '../services/ModelService'
import {Thread} from '../thread/Thread'

@Component({
    selector: 'chatty',
    templateUrl: 'app/chatty/chatty.html',
    directives: [Chatty, Thread]
})
export class Chatty implements OnInit {
    public threads
    public newThreads

    constructor(private modelService:ModelService) {
    }

    ngOnInit() {
        this.threads = this.modelService.getThreads()
        this.newThreads = this.modelService.getNewThreads()
    }
}
