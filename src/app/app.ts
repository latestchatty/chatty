import {Component} from '@angular/core'
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
import {ToastService} from './services/ToastService'

@Component({
    selector: 'app',
    template: '<router-outlet></router-outlet>',
    providers: [
        ActionService,
        ApiService,
        BodyTransformService,
        EventService,
        HotkeyService,
        ModelService,
        ToastService,
        PostService,
        SettingsService,
        ShackMessageService,
        TabService,
        TitleService
    ]
})
export class App  {
    constructor(private hotkeyService:HotkeyService) {
        hotkeyService.start()
    }
}
