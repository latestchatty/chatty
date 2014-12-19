angular.module('chatty')
    .service('settingsService', function($document, $location, $q, apiService, localStorageService) {
        var settingsService = {};

        var collapsedThreads;
        var credentials;
        var tabs;

        settingsService.isCollapsed = function isCollapsed(id) {
            return collapsedThreads.indexOf(Number(id)) >= 0;
        };

        settingsService.cleanCollapsed = function cleanCollapsed(posts) {
            _.remove(collapsedThreads, function(id) {
                return !posts[id];
            });
            localStorageService.set('collapsedThreads', collapsedThreads);
        };


        settingsService.getUsername = function getUsername() {
            return credentials ? credentials.username : '';
        };

        settingsService.getPassword = function getPassword() {
            return credentials.password;
        };

        settingsService.isLoggedIn = function isLoggedIn() {
            return credentials.username && credentials.password;
        };

        settingsService.clearCredentials = function clearCredentials() {
            credentials.username = '';
            credentials.password = '';
            localStorageService.remove('credentials');
        };

        settingsService.setCredentials = function setCredentials(username, password) {
            credentials.username = username;
            credentials.password = password;
            localStorageService.set('credentials', credentials);
        };


        settingsService.getTabs = function getTabs() {
            return tabs;
        };

        settingsService.addTab = function addTab(tab) {
            if (!_.find(tabs, {'filterExpression' : tab.filterExpression})) {
                tabs.push(tab);
            }
            saveTabs();
        };

        settingsService.removeTab = function removeTab(tab) {
            _.pull(tabs, tab);
            saveTabs();
        };

        function saveTabs() {
            var clone = _.cloneDeep(tabs);
            _.each(clone, function(tab) {
                delete tab.selected;
            });
            localStorageService.set('tabs', clone);
        }


        settingsService.isEmbeddedInShacknews = function isEmbeddedInShacknews () {
            return $location.host().indexOf('shacknews.com') >= 0;
        };


        settingsService.load = function load() {
            var deferred = $q.defer();

            collapsedThreads = [];
            credentials = angular.fromJson(localStorageService.get('credentials')) || {username: '', password: ''};
            tabs = angular.fromJson(localStorageService.get('tabs')) || [];

            if (settingsService.isEmbeddedInShacknews()) {
                //Get the username from the hidden shack element.
                var el = $document[0].getElementById('user_posts');
                credentials = {};
                credentials.username = !!el ? el.innerHTML || '' : '';
                credentials.password = '';
            }

            apiService.getMarkedPosts(settingsService.getUsername())
                .success(function(data) {
                    _.each(data.markedPosts, function(mark) {
                        if (mark.type === 'collapsed') {
                            collapsedThreads.push(mark.id);
                        }
                    });

                    deferred.resolve();
                })
                .error(function(data) {
                    console.log('Error getting marked posts: ', data);
                    deferred.resolve();
                });

            return deferred.promise;
        };

        settingsService.refresh = function refresh() {
            //TODO handle refreshing collapsed/pinned/etc
        };

        return settingsService;
    });