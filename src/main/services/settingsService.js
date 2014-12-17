angular.module('chatty')
    .service('settingsService', function($document, $location, localStorageService) {
        var settingsService = {};
        
        var USE_LOCAL_STORAGE = true;
        
        var settingsContainer = {
            collapsedThreads: [],
            tabs: []
        };
        
        settingsService.isEmbeddedInShacknews = function isEmbeddedInShacknews () {
            return $location.host().indexOf('shacknews.com') >= 0;
        };

        //Credentials are special and will always be stored in local storage
        var credentials = angular.fromJson(localStorageService.get('credentials')) || {username: '', password: ''};

        if (settingsService.isEmbeddedInShacknews()) {
            //Get the username from the hidden shack element.
            var el = $document[0].getElementById('user_posts');
            credentials = {};
            credentials.username = !!el ? el.innerHTML || '' : '';
            credentials.password = '';
        }

        settingsService.isCollapsed = function isCollapsed(id) {
            return settingsContainer.collapsedThreads.indexOf(Number(id)) >= 0;
        };

        settingsService.addCollapsed = function addCollapsed(id) {
            if (settingsContainer.collapsedThreads.indexOf(id) < 0) {
                settingsContainer.collapsedThreads.push(id);

                save();
            }
        };

        settingsService.removeCollapsed = function removeCollapsed(id) {
            _.pull(settingsContainer.collapsedThreads, id);
            save();
        };

        settingsService.cleanCollapsed = function cleanCollapsed(posts) {
            _.remove(settingsContainer.collapsedThreads, function(id) {
                return !posts[id];
            });
            save();
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
            return settingsContainer.tabs;
        };

        settingsService.addTab = function addTab(tab) {
            if (!_.find(settingsContainer.tabs, {'filterExpression' : tab.filterExpression})) {
                settingsContainer.tabs.push(tab);
            }
            saveTabs();
        };

        settingsService.removeTab = function removeTab(tab) {
            _.pull(settingsContainer.tabs, tab);
            saveTabs();
        };

        function saveTabs() {
            var clone = _.cloneDeep(settingsContainer.tabs);
            _.each(clone, function(tab) {
                delete tab.selected;
            });
            save();
        }

        function load() {        
            if(USE_LOCAL_STORAGE) {
                var data = angular.fromJson(localStorageService.get('chattyData'));
                if(data) {
                    settingsContainer = data;
                }
            }
        }
        
        function save() {
            if(USE_LOCAL_STORAGE) {
                localStorageService.set('chattyData', settingsContainer);
            }
        }
        
        load();
        
        return settingsService;
    });