import {Component} from 'angular2/core'
import {EventService} from './services/EventService'
import {Chatty} from './chatty/Chatty'
import {ActionService} from './services/ActionService'
import {ApiService} from './services/ApiService'
import {BodyTransformService} from './services/BodyTransformService'
import {EventService} from './services/EventService'
import {ModelService} from './services/ModelService'
import {SettingsService} from './services/SettingsService'
import {ShackMessageService} from './services/ShackMessageService'
import {TabService} from './services/TabService'
import {TitleService} from './services/TitleService'
import {PostService} from './services/PostService'
import {HotkeyService} from './services/HotkeyService'

@Component({
    selector: 'app',
    template: '<chatty></chatty>',
    providers: [
        ActionService,
        ApiService,
        BodyTransformService,
        EventService,
        HotkeyService,
        ModelService,
        PostService,
        SettingsService,
        ShackMessageService,
        TabService,
        TitleService
    ],
    directives: [Chatty]
})
export class App  {
    constructor(private eventService:EventService,
                private hotkeyService:HotkeyService) {
        eventService.startActive()
        hotkeyService.startListening()
    }
}
