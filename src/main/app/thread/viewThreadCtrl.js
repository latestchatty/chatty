module.exports = /* @ngInject */
    function($scope, $routeParams, post, actionService, modelService) {
        $scope.post = post || {}

        //auto expand comments in this view
        $scope.post.state = 'expanded'

        //if we have a selected comment, expand it
        if ($routeParams.commentId && $routeParams.commentId !== $routeParams.threadId) {
            var id = $routeParams.commentId
            var reply = modelService.getPost(id)
            if (reply) {
                actionService.expandReply(reply)
            }
        } else {
            //set the last reply to the top so we can a/z from the start
            actionService.setThread(post)
        }
    }
