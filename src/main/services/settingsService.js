angular.module('chatty')
    .service('settingsService', function($document, $location, localStorageService) {
        var settingsService = {};

        settingsService.isEmbeddedInShacknews = function isEmbeddedInShacknews () {
            return $location.host().indexOf('shacknews.com') >= 0;
        };

        var collapsedThreads = angular.fromJson(localStorageService.get('collapsedThreads')) || [];
        var credentials;
        if(settingsService.isEmbeddedInShacknews()) {
            //Get the username from the hidden shack element.
            var el = $document[0].getElementById('user_posts');
            credentials = {};
            credentials.username = !!el ? el.innerHTML || '' : '';
            credentials.password = '';
        } else {
            credentials = angular.fromJson(localStorageService.get('credentials')) || {username: '', password: ''};
        }
        var tabs = angular.fromJson(localStorageService.get('tabs')) || [];

        settingsService.isCollapsed = function isCollapsed(id) {
            return collapsedThreads.indexOf(Number(id)) >= 0;
        };

        settingsService.addCollapsed = function addCollapsed(id) {
            if (collapsedThreads.indexOf(id) < 0) {
                collapsedThreads.push(id);

                localStorageService.set('collapsedThreads', collapsedThreads);
            }
        };

        settingsService.removeCollapsed = function removeCollapsed(id) {
            _.pull(collapsedThreads, id);
            localStorageService.set('collapsedThreads', collapsedThreads);
        };

        settingsService.cleanCollapsed = function cleanCollapsed(posts) {
            _.remove(collapsedThreads, function(id) {
                return !posts[id];
            });
            localStorageService.set('collapsedThreads', collapsedThreads);
        };


        settingsService.getUsername = function getUsername() {
            return credentials.username;
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

        settingsService.setCredentials = function setCredentials(newCredentials) {
            credentials.username = newCredentials.username;
            credentials.password = newCredentials.password;
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

        return settingsService;
    });