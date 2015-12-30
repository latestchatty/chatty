//import {ModelService} from '../../services/ModelService'
import {Component} from 'angular2/core'

@Component({
    selector: 'chatty',
    templateUrl: 'app/chatty/chatty.html',
    directives: [Chatty]
})
export class Chatty {
    public threads
    private newThreads

    constructor(){
        //this.threads = modelService.getThreads()
        //this.newThreads = modelService.getNewThreads()
        this.threads = [
            {text:'asd', posts: [{text: 'blah', posts:[{text:'aaa!', posts: []}]}]}
        ]
        console.log(this.threads)
    }
}