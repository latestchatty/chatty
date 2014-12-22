angular.module('chatty')
    .service('tabService', function($filter, modelService, settingsService, localStorageService) {
        var tabService = {};

        var threads = modelService.getThreads();
        var tabs = [
            { displayText: 'Chatty', expression: null, selected: true, defaultTab: true, newPostCount: 0 },
            { displayText: 'Frontpage', expression: { author: 'Shacknews'}, defaultTab: true,
                newPostCount: 0, newPostText: 'New front page articles.' },
            { displayText: 'Mine', expression: function() {
                return {$:{ author: settingsService.getUsername() }};
            }, defaultTab: true, newPostCount: 0, newPostText: 'New replies in threads I participated in.' },
            { displayText: 'Replies', expression: function() {
                return {$:{ parentAuthor: settingsService.getUsername() }};
            }, defaultTab: true, newPostCount: 0, newPostText: 'New replies to my posts.' }
        ].concat(angular.fromJson(localStorageService.get('tabs')) || []);
        var selectedTab = tabs[0];

        tabService.getTabs = function() {
            return tabs;
        };

        tabService.selectTab = function(tab) {
            delete selectedTab.selected;
            selectedTab = tab;

            tab.selected = true;
            tab.newPostCount = 0;

            applyFilter(getTabExpression(tab));
        };

        function getTabExpression(tab) {
            return angular.isFunction(tab.expression) ? tab.expression() : tab.expression;
        }

        tabService.newPost = function(thread) {
            _.each(tabs, function(tab) {
                if (!tab.selected) {
                    var expression = getTabExpression(tab);
                    if (expression) {
                        var visible = $filter('filter')([thread], expression);
                        if (visible.length) {
                            tab.newPostCount++;
                        }
                    }
                }
            });
        };

        tabService.addTab = function(expression, displayText, newPostText) {
            var tab = _.find(tabs, {'expression':expression});
            if (!tab) {
                tab = {
                    displayText: displayText,
                    expression: expression,
                    newPostCount: 0,
                    newPostText: newPostText
                };
                tabs.push(tab);
                save();
            }
            return tab;
        };

        tabService.removeTab = function(tab) {
            if (!tab.defaultTab) {
                _.pull(tabs, tab);
                tabService.selectTab(tabs[0]);
                save();
            }
        };

        tabService.filterThreads = function(expression) {
            if (expression) {
                applyFilter({ $: expression });
            } else {
                applyFilter(null);
            }
        };

        function applyFilter(filterExpression) {
            if (filterExpression) {
                _.forEach(threads, function(thread) {
                    delete thread.visible;
                });

                var visibleThreads = $filter('filter')(threads, filterExpression);
                visibleThreads.forEach(function(thread) {
                    thread.visible = true;
                });
            } else {
                _.forEach(threads, function(thread) {
                    thread.visible = true;
                });
            }
        }

        function save() {
            var clone = _.cloneDeep(tabs);
            _.remove(clone, function(tab) {
                delete tab.selected;
                delete tab.newPostCount;
                return tab.defaultTab;
            });
            localStorageService.set('tabs', clone);
        }

        return tabService;
    });