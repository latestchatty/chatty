import {Component, OnInit} from 'angular2/core'
import {ActionService} from '../services/ActionService'
import {PostService} from '../services/PostService'
import {SettingsService} from '../services/SettingsService'
import {ShackMessageService} from '../services/ShackMessageService'
import {TabService} from '../services/TabService'
import {ModelService} from '../services/ModelService'
import {ReplyBox} from '../replybox/ReplyBox'
import {Filter} from "../util/Filter";

@Component({
    selector: 'navbar',
    templateUrl: 'app/navbar/navbar.html',
    directives: [ReplyBox]
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
        setTimeout(() => this.tabService.filterThreads(this.filterExpression))
    }

    selectTab(tab) {
        this.tabService.selectTab(tab)
        window.scrollTo(0, 0)
        this.filterExpression = null
    }

    addTab(expression) {
        return this.tabService.addTab('filter', expression)
    }

    removeTab(tab) {
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
