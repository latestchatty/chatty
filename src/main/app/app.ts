import {Component} from 'angular2/core'
import {EventService} from './services/EventService'

@Component({
    selector: 'app',
    template: 'wat...',
    providers: [EventService]
})
export class App  {
    constructor(private eventService:EventService) {
        eventService.startActive()
    }
}
