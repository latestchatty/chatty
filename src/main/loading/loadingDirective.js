var _ = require('lodash')

module.exports = /* @ngInject */
    function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'loading/loading.html',
            /* @ngInject */
            controller: function($scope) {
                $scope.loadingMessages = [
                    'Think before you post...',
                    'It gets you chicks!',
                    '<span style="color: red; font-weight: bold;"> * N U K E D *</span>',
                    'I ATE A CAT',
                    '\\<span style="text-decoration: underline">8===D</span>/',
                    'Thanks.txt',
                    'Welcome to the world of SPA Chatty. You\'re in for a hell of a ride.',
                    'Please understand.',
                    '----\\\\\\_____O_o/-----------',
                    'YOU LEAVE MY WEBSITE AGAIN, AND IM GONNA KICK YOUR ASS',
                    'Television, had quite a bit of work experience.',
                    'BUT SHOW THEM TO ME',
                    'pics + divx',
                    'Leaving without saying goodbye???',
                    'the dropzone is life',
                    'I\'m an IT professional; well versed in the operating system and security.',
                    'u bread loaf,' +
                    ' (╯°□°）╯︵ ┻━┻ ',
                    '( ͡° ͜ʖ ͡°) ',
                    'Part of my wages are daily Restaurant Tickets',
                    'Congrats JT!',
                    'It was a kite'
                ]
                $scope.loadingMessage = _.sample($scope.loadingMessages)

                $scope.$on('ngRepeatFinished', function() {
                    $scope.isLoaded = true
                })
            }
        }
    }
