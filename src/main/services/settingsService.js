angular.module('chatty')
    .service('settingsService', function($document, $location, $q, apiService, localStorageService) {
        var settingsService = {};

        var collapsedThreads;
        var credentials;

        settingsService.isCollapsed = function(id) {
            return collapsedThreads.indexOf(Number(id)) >= 0;
        };

        settingsService.collapseThread = function(id) {
            collapsedThreads.push(id);
            if (settingsService.isLoggedIn()) {
                apiService.markPost(settingsService.getUsername(), id, 'collapsed');
            }
        };

        settingsService.uncollapseThread = function(id) {
            if (settingsService.isLoggedIn() && _.contains(collapsedThreads, id)) {
                _.pull(collapsedThreads, id);
                apiService.markPost(settingsService.getUsername(), id, 'unmarked');
            }
        };

        settingsService.cleanCollapsed = function(posts) {
            _.each(collapsedThreads, function(id) {
                if (!posts[id]) {
                    apiService.markPost(settingsService.getUsername(), id, 'unmarked');
                }
            });
        };


        settingsService.getUsername = function() {
            return credentials ? credentials.username : '';
        };

        settingsService.getPassword = function() {
            return credentials.password;
        };

        settingsService.isLoggedIn = function() {
            return credentials.username && credentials.password;
        };

        settingsService.clearCredentials = function() {
            credentials.username = '';
            credentials.password = '';
            localStorageService.remove('credentials');
        };

        settingsService.setCredentials = function(username, password) {
            credentials.username = username;
            credentials.password = password;
            localStorageService.set('credentials', credentials);
        };

        settingsService.isEmbeddedInShacknews = function() {
            return $location.host().indexOf('shacknews.com') >= 0;
        };


        settingsService.load = function() {
            collapsedThreads = [];
            credentials = angular.fromJson(localStorageService.get('credentials')) || {username: '', password: ''};

            if (settingsService.isEmbeddedInShacknews()) {
                //Get the username from the hidden shack element.
                var el = $document[0].getElementById('user_posts');
                credentials = {};
                credentials.username = !!el ? el.innerHTML || '' : '';
                credentials.password = '';
            }

            return settingsService.refresh();
        };

        settingsService.refresh = function() {
            var deferred = $q.defer();

            apiService.getMarkedPosts(settingsService.getUsername())
                .success(function(data) {
                    collapsedThreads = [];
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

        return settingsService;
    });