import {Component, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {Thread} from '../thread/Thread'
import {ApiService} from '../services/ApiService'
import {ActionService} from '../services/ActionService'
import {EventService} from '../services/EventService'
import {ModelService} from '../services/ModelService'
import {ToastService} from '../services/ToastService'
import {Subscription} from 'rxjs/Rx'

@Component({
    template: require('./singleThread.html'),
    directives: [Thread]
})
export class SingleThread implements OnInit {
    public post
    public error
    private sub:Subscription

    constructor(private route:ActivatedRoute,
                private actionService:ActionService,
                private apiService:ApiService,
                private eventService:EventService,
                private modelService:ModelService,
                private toastService:ToastService) {
    }

    ngOnInit() {
        //enable passive events
        this.eventService.startPassive()

        this.sub = this.route.params.subscribe(params => {
            let threadId = +params['threadId']
            let commentId = +params['commentId']

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
        })
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
