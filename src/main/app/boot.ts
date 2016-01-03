import {bootstrap} from 'angular2/platform/browser'
import {HTTP_PROVIDERS} from 'angular2/http'
import {Type} from 'angular2/core'
import 'rxjs/Rx'

import {App} from './app'

//Services
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

bootstrap(<Type>App, [
    //core
    HTTP_PROVIDERS,

    //services
    ActionService,
    ApiService,
    BodyTransformService,
    EventService,
    ModelService,
    PostService,
    SettingsService,
    ShackMessageService,
    TabService,
    TitleService
])
