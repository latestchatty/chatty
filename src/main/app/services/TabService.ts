declare var _:any
import {Filter} from '../util/Filter'
import {Injectable} from 'angular2/core'
import {DefaultTabs} from '../util/DefaultTabs'
import {TabTemplates} from '../util/TabTemplates'
import {ModelService} from './ModelService'
import {SettingsService} from './SettingsService'
import {TitleService} from './TitleService'

@Injectable()
export class TabService {
    private selectedTab
    private tabs = _.cloneDeep(DefaultTabs)

    constructor(private modelService:ModelService,
                private settingsService:SettingsService,
                private titleService:TitleService) {
        this.selectedTab = DefaultTabs[0]

        var storageTabs = localStorage.getItem('tabs')
        var loaded = storageTabs ? JSON.parse(storageTabs) : []
        _.each(loaded, tab => this.addTab(tab.tabType, tab.value))
    }

    getTabs() {
        return this.tabs
    }

    selectTab(tab) {
        this.selectedTab.selected = false
        this.selectedTab = tab

        tab.selected = true
        tab.newPostCount = 0

        this.applyFilter(tab.expression)
    }

    newPost(thread, parent, post) {
        if (thread.state !== 'collapsed' && post.author !== this.settingsService.getUsername()) {
            let misc = {username: this.settingsService.getUsername()}

            _.each(this.tabs, tab => {
                if (!tab.selected && tab.newPostFunction && tab.newPostFunction(thread, parent, post, misc)) {
                    tab.newPostCount = (tab.newPostCount || 0) + 1
                    this.titleService.updateTitle(1)
                }
            })
        }
    }

    addTab(tabType, value) {
        var tab = _.find(this.tabs, {tabType: tabType, value: value})

        if (!tab && TabTemplates[tabType]) {
            tab = TabTemplates[tabType](value)
            this.tabs.push(tab)
            this.save()
        }

        return tab
    }

    removeTab(tab) {
        if (!tab.defaultTab) {
            _.pull(this.tabs, tab)
            this.selectTab(this.tabs[0])
            this.save()
        }
    }

    filterThreads(expression) {
        this.applyFilter(expression)
    }

    private applyFilter(filterExpression) {
        let threads = this.modelService.getThreads()
        let misc = {username: this.settingsService.getUsername()}

        if (filterExpression) {
            let visibleThreads
            if (_.isString(filterExpression)) {
                visibleThreads = Filter.filter(threads, filterExpression)
            } else if (_.isFunction(filterExpression)) {
                visibleThreads = _.filter(threads, thread => filterExpression(thread, misc))
            }
            _.each(threads, thread => {
                thread.visible = _.contains(visibleThreads, thread)
            })
        } else {
            _.each(threads, thread => {
                thread.visible = thread.state !== 'collapsed'
            })
        }
    }

    private save() {
        var filtered = _.filter(_.cloneDeep(this.tabs), tab => !!tab.tabType)
        var cleaned = _.map(filtered, tab => ({
            tabType: tab.tabType,
            value: tab.value
        }))
        localStorage.setItem('tabs', JSON.stringify(cleaned))
    }
}
