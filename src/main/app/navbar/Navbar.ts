declare var _:any
import {Component, OnInit} from 'angular2/core'
import {ActionService} from '../services/ActionService'
import {DisableHotkeys} from '../directives/DisableHotkeys'
import {PostService} from '../services/PostService'
import {SettingsService} from '../services/SettingsService'
import {ShackMessageService} from '../services/ShackMessageService'
import {TabService} from '../services/TabService'
import {ModelService} from '../services/ModelService'
import {ReplyBox} from '../replybox/ReplyBox'

@Component({
    selector: 'navbar',
    templateUrl: 'app/navbar/navbar.html',
    directives: [DisableHotkeys, ReplyBox]
})
export class Navbar implements OnInit {
    public loginRunning = false
    public loginInvalid = false
    public username
    public password
    public postQueue
    public newThreads
    public newThreadPost = {id: 0, replying: false}
    public tabs
    public filterExpression
    private skipFilter = false

    constructor(private actionService:ActionService,
                private modelService:ModelService,
                private postService:PostService,
                private settingsService:SettingsService,
                private shackMessageService:ShackMessageService,
                private tabService:TabService) {
    }

    ngOnInit() {
        this.username = this.settingsService.getUsername()
        this.newThreads = this.modelService.getNewThreads()
        this.postQueue = this.postService.getQueue()
        this.tabs = this.tabService.getTabs()
    }

    isLoggedIn() {
        return this.settingsService.isLoggedIn()
    }

    doLogin() {
        this.loginRunning = true
        this.loginInvalid = false
        this.actionService.login(this.username, this.password)
            .then(result => {
                if (result) {
                    this.shackMessageService.refresh()
                } else {
                    this.loginInvalid = true
                }
                this.password = null
                this.loginRunning = false
            })
    }

    doLogout() {
        this.shackMessageService.clear()
        this.postService.clearQueue()
        this.username = null
        this.password = null
        this.actionService.logout()
        this.loginRunning = false
        this.loginInvalid = false
    }

    clearPostQueue() {
        this.postService.clearQueue()
    }

    filterChanged() {
        if (!this.skipFilter) {
            this.tabService.selectTab(this.tabs[0], true)
            this.tabService.filterThreads(this.filterExpression)
        } else {
            this.skipFilter = false
        }
    }
    filterChangedDebounce = _.debounce(() => this.filterChanged(), 150)

    selectTab(tab) {
        //don't filter back, just select tab
        this.skipFilter = true
        this.filterExpression = null

        window.scrollTo(0, 0)

        this.tabService.selectTab(tab)
    }

    addFilterTab() {
        let tab = this.tabService.addTab('filter', this.filterExpression)
        this.selectTab(tab)
    }

    removeTab($event, tab) {
        $event.preventDefault()
        this.tabService.removeTab(tab)
    }

    newThread() {
        if (!this.newThreadPost.replying) {
            this.actionService.openReplyBox(this.newThreadPost)
        } else {
            this.newThreadPost.replying = false
        }
    }

    reflowThreads() {
        window.scrollTo(0, 0)
        this.tabService.selectTab(this.tabs[0])
        this.actionService.reflowThreads()
        this.filterExpression = null
    }

    getTotalMessageCount() {
        return this.shackMessageService.getTotalMessageCount()
    }

    getUnreadMessageCount() {
        return this.shackMessageService.getUnreadMessageCount()
    }

    goToInbox() {
        return this.shackMessageService.goToInbox()
    }
}
