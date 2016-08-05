import {Component} from '@angular/core'
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated'
import {SimpleChatty} from './chatty/SimpleChatty'
import {SplitChatty} from './chatty/SplitChatty'
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
import {SingleThread} from './singleThread/SingleThread'

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
    {path: '/chatty', name: 'Chatty', component: SimpleChatty, useAsDefault: true},
    {path: '/chatty/simple', name: 'Chatty', component: SimpleChatty},
    {path: '/chatty/split', name: 'Chatty', component: SplitChatty},
    {path: '/thread/:threadId/:commentId', name: 'Thread', component: SingleThread}
])
export class App  {
    constructor(private hotkeyService:HotkeyService) {
        hotkeyService.start()
    }
}
