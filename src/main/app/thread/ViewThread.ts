import {OnInit} from 'angular2/core'



post: function($route, $location, apiService, modelService) {
    var threadId = $route.current.params.threadId
    if (threadId) {
        return apiService.getThread(threadId).then(function(response) {
            var post = response.data.threads[0]
            if (threadId !== post.threadId) {
                $location.url('/thread/' + post.threadId + '/' + threadId)
            } else {
                return modelService.addThread(post)
            }
        })
    }
}







export class ViewThread implements OnInit{
    ngOnInit(){
        eventService.startPassive()
    }

    public post =
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