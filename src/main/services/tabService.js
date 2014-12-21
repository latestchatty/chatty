angular.module('chatty')
    .service('tabService', function($filter, modelService, settingsService, localStorageService) {
        var tabService = {};

        var threads = modelService.getThreads();
        var tabs = [
            { displayText: 'Chatty', expression: null, selected: true, defaultTab: true, newPostCount: 0 },
            { displayText: 'Frontpage', expression: { author: 'Shacknews'}, defaultTab: true, newPostCount: 0 },
            { displayText: 'Mine', expression: function() {
                return {$:{ author: settingsService.getUsername() }};
            }, defaultTab: true, newPostCount: 0 },
            { displayText: 'Replies', expression: function() {
                return {$:{ parentAuthor: settingsService.getUsername() }};
            }, defaultTab: true, newPostCount: 0 }
        ].concat(angular.fromJson(localStorageService.get('tabs')) || []);
        var selectedTab = tabs[0];

        tabService.getTabs = function() {
            return tabs;
        };

        tabService.selectTab = function(tab) {
            delete selectedTab.selected;
            selectedTab = tab;

            tab.selected = true;
            var expression = angular.isFunction(tab.expression) ? tab.expression() : tab.expression;
            applyFilter(expression);
        };

        tabService.addTab = function(expression, displayText) {
            var existing = _.find(tabs, {'expression':expression});
            if (!existing) {
                var tab = {
                    displayText: displayText,
                    expression: expression,
                    newPostCount: 0
                };
                tabs.push(tab);
                save();
            }
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
                return tab.defaultTab;
            });
            localStorageService.set('tabs', clone);
        }

        return tabService;
    });