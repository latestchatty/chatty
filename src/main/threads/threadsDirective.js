angular.module('chatty')
    .directive('threads', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'threads/threads.html',
            controller: function($scope, modelService, actionService) {
                //load full chatty on start
                $scope.threads = modelService.getThreads();
                $scope.newThreads = modelService.getNewThreads();
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
                    '( ͡° ͜ʖ ͡°) '
                ];
                $scope.loadingMessage = _.sample($scope.loadingMessages);

                $scope.$on('ngRepeatFinished', function() {
                    $scope.isLoaded = true;
                });

                $scope.expandThread = function(thread) {
                    actionService.expandThread(thread);
                };
            }
        };
    });
