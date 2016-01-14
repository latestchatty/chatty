import {Component} from 'angular2/core'
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router'
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
import {SingleThread} from './singleThread/SingleThread'
import {ToastService} from "./toast/ToastService";

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
    ],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/chatty', name: 'Chatty', component: Chatty, useAsDefault: true},
    {path: '/thread/:threadId/:commentId', name: 'Thread', component: SingleThread}
])
export class App  {
    constructor(private hotkeyService:HotkeyService) {
        hotkeyService.start()
    }
}
