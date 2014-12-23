angular.module('chatty')
    .service('tabService', function($filter, modelService, settingsService, localStorageService) {
        var tabService = {};

        var threads = modelService.getThreads();
        var tabs = [
            {
                displayText: 'Chatty',
                expression: null,
                selected: true,
                defaultTab: true
            }, {
                displayText: 'Frontpage',
                expression: { author: 'Shacknews' },
                defaultTab: true,
                newPostText: 'New front page articles.',
                newPostFunction: function(thread, parent, post) {
                    return post.author === 'Shacknews';
                }
            }, {
                displayText: 'Mine',
                expression: function() {
                    return {$: {author: settingsService.getUsername()}};
                },
                defaultTab: true,
                newPostText: 'New replies in threads I participated in.'
            }, {
                displayText: 'Replies',
                expression: function() {
                    return {$: {parentAuthor: settingsService.getUsername()}};
                },
                defaultTab: true,
                newPostText: 'New replies to my posts.',
                newPostFunction: function(thread, parent, post) {
                    return post.parentAuthor === settingsService.getUsername();
                }
            }
        ];
        var tabTemplates = {
            user: function(value) {
                return {
                    tabType: 'user',
                    value: value,
                    displayText: value,
                    expression: { author: value },
                    newPostText: 'New replies in threads participated in by this user.',
                    newPostFunction: function(thread, parent, post) {
                        return post.author === this.displayText;
                    }
                };
            },
            post: function(value) {
                return {
                    tabType: 'post',
                    value: value,
                    displayText: 'post',
                    expression: { id: value },
                    newPostText: 'New replies in this specific post.',
                    newPostFunction: function(thread, parent, post) {
                        return post.author === this.displayText;
                    }
                };
            },
            filter: function(value) {
                return {
                    tabType: 'filter',
                    value: value,
                    displayText: value,
                    expression: { $: value },
                    newPostText: 'New replies in threads with this search term.',
                    newPostFunction: function(thread, parent, post) {
                        return post.author === this.displayText;
                    }
                };
            }
        };
        var selectedTab = tabs[0];

        tabService.setThreads = function(newThreads) {
            threads = newThreads;
        };

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

        tabService.newPost = function(thread, parent, post) {
            if (thread.state !== 'collapsed' && post.author !== settingsService.getUsername()) {
                _.each(tabs, function(tab) {
                    if (!tab.selected) {
                        var increment = false;

                        if (angular.isFunction(tab.newPostFunction)) {
                            increment = tab.newPostFunction(thread, parent, post);
                        } else {
                            var expression = getTabExpression(tab);
                            if (expression) {
                                increment = !!$filter('filter')([thread], expression).length;
                            }
                        }

                        if (increment) {
                            tab.newPostCount++;
                        }
                    }
                });
            }
        };

        tabService.addTab = function(tabType, value) {
            var tab = _.find(tabs, {'tabType': tabType, 'value': value});

            if (!tab) {
                tab = tabTemplates[tabType](value);
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
            var filtered = _.filter(_.cloneDeep(tabs), function(tab) {
                return !!tab.tabType;
            });
            var cleaned = _.map(filtered, function(tab) {
                return {
                    tabType: tab.tabType,
                    value: tab.value
                };
            });
            localStorageService.set('tabs', cleaned);
        }

        //load on startup
        var loaded = angular.fromJson(localStorageService.get('tabs')) || [];
        _.each(loaded, function(tab) {
            tabService.addTab(tab.tabType, tab.value);
        });

        return tabService;
    });