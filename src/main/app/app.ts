import {Component} from 'angular2/core'
import {ApiService} from './services/ApiService'

@Component({
    selector: 'app',
    template: 'wat...',
    providers: [ApiService]
})
export class App  {
    constructor(private apiService:ApiService) {
        apiService.getChatty()
            .then(threads => {
                console.log('threads', threads)
            })
    }
}
