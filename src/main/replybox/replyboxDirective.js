module.exports = /* @ngInject */
    function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'replybox/replybox.html',
            scope: {
                post: '='
            },
            /* @ngInject */
            controller: function($scope, actionService, postService, settingsService) {
                $scope.replyBody = ''
                $scope.tagGroups = [
                    [{name: 'red', class: 'jt_red', open: 'r{', close: '}r'},
                        {name: 'italics', class: 'jt_italic', open: '/[', close: ']/'}],
                    [{name: 'green', class: 'jt_green', open: 'g{', close: '}g'},
                        {name: 'bold', class: 'jt_bold', open: 'b[', close: ']b'}],
                    [{name: 'blue', class: 'jt_blue', open: 'b{', close: '}b'},
                        {name: 'quote', class: 'jt_quote', open: 'q[', close: ']q'}],
                    [{name: 'yellow', class: 'jt_yellow', open: 'y{', close: '}y'},
                        {name: 'sample', class: 'jt_sample', open: 's[', close: ']s'}],
                    [{name: 'olive', class: 'jt_olive', open: 'e[', close: ']e'},
                        {name: 'underline', class: 'jt_underline', open: '_[', close: ']_'}],
                    [{name: 'lime', class: 'jt_lime', open: 'l[', close: ']l'},
                        {name: 'strike', class: 'jt_strike', open: '-[', close: ']-'}],
                    [{name: 'orange', class: 'jt_orange', open: 'n[', close: ']n'},
                        {name: 'spoiler', class: 'jt_spoiler', open: 'o[', close: ']o'}],
                    [{name: 'pink', class: 'jt_ping', open: 'p[', close: ']p'},
                        {name: 'code', class: 'jt_codesmall', open: '/{{', close: '}}/'}]
                ]

                $scope.addTag = function(tag) {
                    $scope.replyBody += tag.open + tag.close
                }

                $scope.submitPost = function() {
                    if ($scope.replyBody) {
                        postService.submitPost($scope.post.id, $scope.replyBody)
                        $scope.close()
                    }
                }

                $scope.close = function() {
                    actionService.closePostReplyBox($scope.post)
                }

                $scope.isLoggedIn = settingsService.isLoggedIn
            }
        }
    }
