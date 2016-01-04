import {bootstrap} from 'angular2/platform/browser'
import {HTTP_PROVIDERS} from 'angular2/http'
import {Type} from 'angular2/core'
import 'rxjs/Rx'

import {App} from './app'

bootstrap(<Type>App, [
    //core
    HTTP_PROVIDERS
])
