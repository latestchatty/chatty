import {Component} from 'angular2/core'
import {EventService} from './services/EventService'
import {Chatty} from './chatty/Chatty'

@Component({
    selector: 'app',
    template: '<chatty></chatty>',
    providers: [EventService],
    directives: [Chatty]
})
export class App  {
    constructor(private eventService:EventService) {
        eventService.startActive()
    }
}
