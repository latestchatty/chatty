declare var _: any
import {Injectable} from 'angular2/core'
import * as DefaultTabs from '../util/DefaultTabs'
import * as TabTemplates from '../util/TabTemplates'
import {ModelService} from './ModelService'
import {SettingsService} from './SettingsService'
import {TitleService} from './TitleService'

@Injectable()
export class TabService {
    //private threads
    //private selectedTab
    //
    //constructor(private modelService:ModelService,
    //            private settingsService:SettingsService,
    //            private titleService:TitleService) {
    //}
    //
    //ngOnInit() {
    //    this.threads = this.modelService.getThreads()
    //    this.selectedTab = this.tabs[0]
    //
    //    var storageTabs = localStorage.getItem('tabs')
    //    var loaded = storageTabs ? JSON.parse(storageTabs) : []
    //    _.each(loaded, tab => this.addTab(tab.tabType, tab.value))
    //}
    //
    //setThreads(newThreads) {
    //    this.threads = newThreads
    //}
    //
    //getTabs() {
    //    return DefaultTabs
    //}
    //
    //selectTab(tab) {
    //    delete this.selectedTab.selected
    //    this.selectedTab = tab
    //
    //    tab.selected = true
    //    tab.newPostCount = 0
    //    this.updateCounts()
    //
    //    this.applyFilter(this.getTabExpression(tab))
    //}
    //
    //private getTabExpression(tab) {
    //    return _.isFunction(tab.expression) ? tab.expression() : tab.expression
    //}
    //
    //newPost(thread, parent, post) {
    //    if (thread.state !== 'collapsed' && post.author !== this.settingsService.getUsername()) {
    //        _.each(this.tabs, function(tab) {
    //            if (!tab.selected) {
    //                var increment = false
    //
    //                if (_.isFunction(tab.newPostFunction)) {
    //                    increment = tab.newPostFunction(thread, parent, post)
    //                } else {
    //                    var expression = this.getTabExpression(tab)
    //                    if (expression) {
    //                        increment = !!$filter('filter')([post], expression).length
    //                    }
    //                }
    //
    //                if (increment) {
    //                    tab.newPostCount = (tab.newPostCount || 0) + 1
    //                    this.updateCounts()
    //                }
    //            }
    //        })
    //    }
    //}
    //
    //addTab(tabType, value) {
    //    var tab = _.find(this.tabs, {tabType: tabType, value: value})
    //
    //    if (!tab && TabTemplates[tabType]) {
    //        tab = TabTemplates[tabType](value)
    //        this.tabs.push(tab)
    //        this.save()
    //    }
    //
    //    return tab
    //}
    //
    //removeTab(tab) {
    //    if (!tab.defaultTab) {
    //        _.pull(tabs, tab)
    //        this.selectTab(tabs[0])
    //        this.save()
    //    }
    //}
    //
    //filterThreads(expression) {
    //    if (expression) {
    //        this.applyFilter({$: expression})
    //    } else {
    //        this.applyFilter(null)
    //    }
    //}
    //
    //private updateCounts() {
    //    //update title bar count
    //    this.titleService.count = _.sum(tabs, 'newPostCount')
    //    this.titleService.updateTitle(0)
    //}
    //
    //private applyFilter(filterExpression) {
    //    _.each(threads, function(thread) {
    //        delete thread.visible
    //    })
    //
    //    if (filterExpression) {
    //        var visibleThreads = $filter('filter')(threads, filterExpression)
    //        _.each(visibleThreads, thread => thread.visible = true)
    //    } else {
    //        _.each(threads, thread => {
    //            if (thread.state !== 'collapsed') {
    //                thread.visible = true
    //            }
    //        })
    //    }
    //}
    //
    //private save() {
    //    var filtered = _.filter(_.cloneDeep(tabs), tab => !!tab.tabType)
    //    var cleaned = _.map(filtered, tab => ({
    //        tabType: tab.tabType,
    //        value: tab.value
    //    }))
    //    localStorageService.set('tabs', cleaned)
    //}
}
