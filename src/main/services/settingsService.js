angular.module('chatty')
    .service('settingsService', function($document, $location, $http, $window, localStorageService) {
        var settingsService = {};
        
        var USE_LOCAL_STORAGE = false;
        
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
            //TODO: When the user logs in, they shouldn't have to refresh to see their cloud synced data.
            //TODO: Periodically load settings so we get fresh tabs from other instances.
            //If we're overriding to use local storage, do it.
            //If we're not logged in, also use local storage.
            if(USE_LOCAL_STORAGE || !settingsService.isLoggedIn()) {
                var data = angular.fromJson(localStorageService.get('chattyData'));
                if(data) {
                    settingsContainer = data;
                }
            } else {
                $http.get($window.location.protocol + '//winchatty.com/v2/clientData/getClientData', {params: {username: settingsService.getUsername(), client: "nixxed"}, responseType: "text"})
                .success(function(data) {
                    //populate settings data container.
                    var j = JSON.parse($window.atob(data.data));
                    //TODO: Maybe a different way to notify things that settings have updated and things should refresh...
                    settingsContainer.tabs.length = 0; //Clear the array and add to it because the binding has already been set.
                    for (var t in j.tabs) {
                        var tab = j.tabs[t];
                        settingsContainer.tabs.push(tab);
                    }
                    settingsContainer.collapsedThreads.length = 0;
                    for (var ct in j.collapsedThreads) {
                        var collapsedThread = j.collapsedThreads[ct];
                        settingsContainer.collapsedThreads.push(collapsedThread);
                    }
                }).error(function(data) {
                    console.log('Error during settingsLoad - custom: ', data);
                });
                
                //TODO: Use winchatty markPost for collapse and tabbed things with IDs - http://winchatty.com/v2/readme#_Toc405750611
            }
        }
        
        function save() {
            if(USE_LOCAL_STORAGE || !settingsService.isLoggedIn()) {
                localStorageService.set('chattyData', settingsContainer);
            } else {
                //post additional settings data to winchatty.  Pin/Collapse is done at the time they're pinned so it's not necessary here.
                var d = $window.btoa(JSON.stringify(settingsContainer));
                post($window.location.protocol + '//winchatty.com/v2/clientData/setClientData', {username: settingsService.getUsername(), client: "nixxed", data: d})
                .success(function(data) {
                    
                }).error(function(data) {
                    console.log('Error during settingsLoad - custom: ', data);
                });
            }
        }
        
        function post(url, params) {
            var data = _.reduce(params, function(result, value, key) {
                return result + (result.length > 0 ? '&' : '') + key + '=' + encodeURIComponent(value);
            }, '');

            var config = {
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };

            return $http(config);
        }
        
        load();
        
        return settingsService;
    });