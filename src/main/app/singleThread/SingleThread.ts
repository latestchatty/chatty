import {Component} from 'angular2/core'
import {OnInit} from 'angular2/core'
import {ModelService} from '../services/ModelService'
import {Thread} from '../thread/Thread'
import {Navbar} from '../navbar/Navbar'
import {RouteParams} from 'angular2/router'
import {ApiService} from '../services/ApiService'
import {EventService} from '../services/EventService'
import {ActionService} from '../services/ActionService'

@Component({
    templateUrl: 'app/singleThread/singleThread.html',
    directives: [Thread]
})
export class SingleThread implements OnInit {
    public post

    constructor(private actionService:ActionService,
                private apiService:ApiService,
                private eventService:EventService,
                private modelService:ModelService,
                private routeParams:RouteParams) {

    }

    ngOnInit() {
        //enable passive events
        this.eventService.startPassive()

        var threadId = this.routeParams.params['threadId']
        var commentId = this.routeParams.params['commentId']
        if (threadId) {
            return this.apiService.getThread(threadId)
                .then(response => {
                    let post = response.threads[0]
                    let fixed = this.modelService.addThread(post, null)
                    fixed.state = 'expanded'
                    threadId = fixed.threadId

                    this.post = fixed

                    if (commentId && commentId !== threadId) {
                        //expand selected reply
                        var reply = this.modelService.getPost(commentId)
                        if (reply) {
                            this.actionService.expandReply(reply)
                        }
                    } else {
                        //set the last reply to the top so we can a/z from the start
                        this.actionService.setThread(post)
                    }
                })
        }
    }
}
