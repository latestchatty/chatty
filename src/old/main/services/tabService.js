var _ = require('lodash')
var angular = require('angular')

module.exports = /* @ngInject */
    function($filter, modelService, settingsService, localStorageService, titleService) {
        var tabService = {}

        var threads = modelService.getThreads()
        var tabs = [
            {
                displayText: 'Chatty',
                expression: null,
                selected: true,
                defaultTab: true
            }, {
                displayText: 'Frontpage',
                expression: {author: 'Shacknews'},
                defaultTab: true,
                newPostText: 'New front page articles.',
                newPostFunction: (thread, parent, post) => post.author === 'Shacknews'
            }, {
                displayText: 'Mine',
                expression: () => ({$: {author: settingsService.getUsername()}}),
                defaultTab: true,
                newPostFunction: () => false
            }, {
                displayText: 'Replies',
                expression: () => ({$: {author: settingsService.getUsername()}}),
                defaultTab: true,
                newPostText: 'New replies to my posts.',
                newPostFunction: (thread, parent, post) => post.parentAuthor === settingsService.getUsername()
            }
        ]
        var tabTemplates = {
            user: function(value) {
                return {
                    tabType: 'user',
                    value: value,
                    displayText: value,
                    expression: {author: value},
                    newPostText: 'New replies in threads participated in by this user.',
                    newPostFunction: function(thread, parent, post) {
                        return post.author === this.displayText
                    }
                }
            },
            filter: function(value) {
                return {
                    tabType: 'filter',
                    value: value,
                    displayText: value,
                    expression: {$: value},
                    newPostText: 'New posts containing this search term.'
                }
            }
        }
        var selectedTab = tabs[0]

        tabService.setThreads = newThreads => threads = newThreads
        tabService.getTabs = () => tabs

        tabService.selectTab = function(tab) {
            delete selectedTab.selected
            selectedTab = tab

            tab.selected = true
            tab.newPostCount = 0
            updateCounts()

            applyFilter(getTabExpression(tab))
        }

        function getTabExpression(tab) {
            return _.isFunction(tab.expression) ? tab.expression() : tab.expression
        }

        tabService.newPost = function(thread, parent, post) {
            if (thread.state !== 'collapsed' && post.author !== settingsService.getUsername()) {
                _.each(tabs, function(tab) {
                    if (!tab.selected) {
                        var increment = false

                        if (_.isFunction(tab.newPostFunction)) {
                            increment = tab.newPostFunction(thread, parent, post)
                        } else {
                            var expression = getTabExpression(tab)
                            if (expression) {
                                increment = !!$filter('filter')([post], expression).length
                            }
                        }

                        if (increment) {
                            tab.newPostCount = (tab.newPostCount || 0) + 1
                            updateCounts()
                        }
                    }
                })
            }
        }

        tabService.addTab = function(tabType, value) {
            var tab = _.find(tabs, {tabType: tabType, value: value})

            if (!tab && tabTemplates[tabType]) {
                tab = tabTemplates[tabType](value)
                tabs.push(tab)
                save()
            }

            return tab
        }

        tabService.removeTab = function(tab) {
            if (!tab.defaultTab) {
                _.pull(tabs, tab)
                tabService.selectTab(tabs[0])
                save()
            }
        }

        tabService.filterThreads = function(expression) {
            if (expression) {
                applyFilter({$: expression})
            } else {
                applyFilter(null)
            }
        }

        function updateCounts() {
            //update title bar count
            titleService.count = _.sum(tabs, 'newPostCount')
            titleService.updateTitle(0)
        }

        function applyFilter(filterExpression) {
            _.each(threads, function(thread) {
                delete thread.visible
            })

            if (filterExpression) {
                var visibleThreads = $filter('filter')(threads, filterExpression)
                _.each(visibleThreads, thread => thread.visible = true)
            } else {
                _.each(threads, thread => {
                    if (thread.state !== 'collapsed') {
                        thread.visible = true
                    }
                })
            }
        }

        function save() {
            var filtered = _.filter(_.cloneDeep(tabs), tab => !!tab.tabType)
            var cleaned = _.map(filtered, tab => ({
                tabType: tab.tabType,
                value: tab.value
            }))
            localStorageService.set('tabs', cleaned)
        }

        //load on startup
        var loaded = angular.fromJson(localStorageService.get('tabs')) || []
        _.each(loaded, tab => tabService.addTab(tab.tabType, tab.value))
        return tabService
    }
