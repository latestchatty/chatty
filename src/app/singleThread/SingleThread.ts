import {Component, OnInit} from '@angular/core'
import {RouteParams} from '@angular/router-deprecated'
import {Thread} from '../thread/Thread'
import {ApiService} from '../services/ApiService'
import {ActionService} from '../services/ActionService'
import {EventService} from '../services/EventService'
import {ModelService} from '../services/ModelService'
import {ToastService} from '../services/ToastService'

@Component({
    template: require('./singleThread.html'),
    directives: [Thread]
})
export class SingleThread implements OnInit {
    public post
    public error

    constructor(private actionService:ActionService,
                private apiService:ApiService,
                private eventService:EventService,
                private modelService:ModelService,
                private routeParams:RouteParams,
                private toastService:ToastService) {
    }

    ngOnInit() {
        //enable passive events
        this.eventService.startPassive()

        var threadId = this.routeParams.params['threadId']
        var commentId = this.routeParams.params['commentId']
        if (threadId) {
            return this.apiService.getThread(threadId)
                .subscribe(response => {
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
                }, error => {
                    this.error = true
                    console.log('Error loading single thread', error)
                    this.toastService.warn('Error loading thread.')
                })
        }
    }
}
