declare var _:any
import {Injectable} from 'angular2/core'
import {Subscription} from 'rxjs/Subscription'
import {ApiService} from './ApiService'
import {ModelService} from './ModelService'
import {SettingsService} from './SettingsService'
import {ShackMessageService} from './ShackMessageService'
import {TabService} from './TabService'
import {TitleService} from './TitleService'
import {ToastService} from './ToastService'

@Injectable()
export class EventService {
    private lastEventId:Number = 0
    private passiveMode:Boolean = false
    private waitingEvent:Subscription<any> = null

    constructor(private apiService:ApiService,
                private modelService:ModelService,
                private settingsService:SettingsService,
                private shackMessageService:ShackMessageService,
                private tabService:TabService,
                private titleService:TitleService,
                private toastService:ToastService) {
    }

    public startActive() {
        this.modelService.clear()

        //get newest event at the time
        this.apiService.getNewestEventId()
            .subscribe(response => this.lastEventId = _.get(response, 'eventId'),
                error => {
                    console.error('Error during getNewestEventId.', error)
                    this.toastService.warn('Error getting newest event id.')
                })

        //load initial full chatty
        this.apiService.getChatty()
            .subscribe(response => {
                //process all threads
                _.each(response.threads, thread => this.modelService.addThread(thread, null))

                //clean collapsed thread list after initial load
                this.modelService.cleanCollapsed()

                //reorder pinned threads
                this.handlePinnedThreads()

                //start events
                return this.waitForEvents()
            }, error => {
                console.error('Error during getChatty: ', error)
                this.toastService.warn('Error getting chatty. Please reload page.')
            })

        //update loop every 5 min
        setInterval(() => {
            this.modelService.updateAllThreads()
            this.shackMessageService.refresh()
            this.settingsService.refresh()
            this.waitForEvents()
        }, 300000)

        //initial refresh of shack messages
        this.shackMessageService.refresh()
    }

    public startPassive() {
        this.passiveMode = true
        this.titleService.setPassive()

        window.addEventListener('storage', event => {
            if (event.key === 'event') {
                var data = JSON.parse(event.newValue)
                var result = this.newEvent(data)

                //update title bar count
                if (result) {
                    this.titleService.updateTitle(1)
                }
            }
        })
    }

    private handlePinnedThreads() {
        var pinnedThreads = this.settingsService.getPinned()
        var threads = this.modelService.getThreads()

        _.each(pinnedThreads, threadId => {
            var thread = this.modelService.getPost(threadId)
            if (!thread) {
                //load expired thread
                this.apiService.getThread(threadId)
                    .subscribe(response => {
                        var thread = _.get(response, 'threads[0]')
                        if (thread) {
                            thread = this.modelService.addThread(thread, false)
                            thread.pinned = true

                            //put it at the top of the list
                            _.pull(threads, thread)
                            threads.unshift(thread)
                        }
                    }, error => {
                        let msg = `Error loading pinned threadId=${threadId}.`
                        console.error(msg, error)
                        this.toastService.warn(msg)
                    })
            } else {
                //put it at the top of the list
                thread.pinned = true
                _.pull(threads, thread)
                threads.unshift(thread)
            }
        })
    }

    private waitForEvents() {
        //if we duplicate call, just cancel last
        if (this.waitingEvent) {
            this.waitingEvent.unsubscribe()
        }

        this.waitingEvent = this.apiService.waitForEvent(this.lastEventId)
            .subscribe(response => this.eventResponse(response),
                error => this.handleEventError(error))
    }

    private eventResponse(response) {
        if (response && !response.error) {
            this.lastEventId = response.lastEventId || this.lastEventId

            //process the events
            _.each(response.events, event => this.newEvent(event))

            //wait for more
            this.waitForEvents()
        } else {
            this.handleEventError(response)
        }
    }

    private handleEventError(event) {
        if (event && event.error && event.code === 'ERR_TOO_MANY_EVENTS') {
            console.error('Too many events since last refresh, reloading chatty.')
            this.toastService.warn('Too many events since last refresh. Reloading full chatty.')
            this.startActive()
        } else {
            //restart events in 30s
            console.error('Unknown error', event)
            this.toastService.warn('Unknown error with event. Restarting events in 30 seconds.')
            setTimeout(() => this.waitForEvents(), 30000)
        }
    }

    private newEvent(event) {
        //store the event for other tabs to process
        if (!this.passiveMode) {
            localStorage.setItem('event', JSON.stringify(event))
        }

        if (event.eventType === 'newPost') {
            if (event.eventData.post.parentId === 0 && !this.passiveMode) {
                return this.modelService.addThread(event.eventData.post, true)
            } else {
                var data = this.modelService.addPost(event.eventData.post, null)
                if (data) {
                    this.tabService.newPost(data.thread, data.parent, data.post)
                }
                return data
            }
        } else if (event.eventType === 'categoryChange') {
            return this.modelService.changeCategory(event.eventData.postId, event.eventData.category)
        } else if (event.eventType === 'lolCountsUpdate') {
            //not supported
        } else {
            console.error('Unhandled event', event)
            this.toastService.warn('Unhandled chatty event.')
        }
    }
}
