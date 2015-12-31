import {Component} from 'angular2/core'


@Component({
    selector: 'thread',
    templateUrl: 'app/thread/thread.html'
})
export class Thread {
    expandThread(thread) {
        //actionService.expandThread(thread)
        console.log('get actionservice!')
    }
}