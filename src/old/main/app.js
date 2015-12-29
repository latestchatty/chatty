var angular = require('angular')
require('angular-route')
require('angular-local-storage')
require('angular-recursion')
require('angular-sanitize')
require('lodash')

angular.module('chatty',
    ['ngRoute', 'ngSanitize', 'RecursionHelper', 'LocalStorageModule'],
    require('./config/rootScopeConfig'))

    //config
    .config(require('./config/routesConfig'))

    //controllers
    .controller('messagesCtrl', require('./messages/messagesCtrl'))
    .controller('viewThreadCtrl', require('./thread/viewThreadCtrl'))

    //directives
    .directive('autoFocus', require('./directives/autoFocusDirective'))
    .directive('chatty', require('./chatty/chattyDirective'))
    .directive('comments', require('./comments/commentsDirective'))
    .directive('countdownTimer', require('./directives/countdownTimerDirective'))
    .directive('embedContent', require('./embedContent/embedContentDirective'))
    .directive('hotkeys', require('./directives/hotkeysDirective'))
    .directive('keepScroll', require('./directives/keepScrollDirective'))
    .directive('lineHighlight', require('./directives/lineHighlightDirective'))
    .directive('loading', require('./loading/loadingDirective'))
    .directive('navbar', require('./navbar/navbarDirective'))
    .directive('ngIfEvent', require('./directives/ngIfEventDirective'))
    .directive('ngRightClick', require('./directives/ngRightClickDirective'))
    .directive('onFinishRender', require('./directives/onFinishRenderDirective'))
    .directive('post', require('./post/postDirective'))
    .directive('postCategory', require('./directives/postCategoryDirective'))
    .directive('replybox', require('./replybox/replyboxDirective'))
    .directive('scrollIntoView', require('./directives/scrollIntoViewDirective'))
    .directive('scrollItem', require('./directives/scrollItemDirective'))
    .directive('thread', require('./thread/threadDirective'))

    //filters
    .filter('trusted', require('./filters/trustedFilter'))

    //services
    .service('actionService', require('./services/actionService'))
    .service('apiService', require('./services/apiService'))
    .service('bodyTransformService', require('./services/bodyTransformService'))
    .service('eventService', require('./services/eventService'))
    .service('modelService', require('./services/modelService'))
    .service('postService', require('./services/postService'))
    .service('settingsService', require('./services/settingsService'))
    .service('shackMessageService', require('./services/shackMessageService'))
    .service('tabService', require('./services/tabService'))
    .service('titleService', require('./services/titleService'))
