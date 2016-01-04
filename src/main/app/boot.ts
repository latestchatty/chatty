import {bootstrap} from 'angular2/platform/browser'
import {HTTP_PROVIDERS} from 'angular2/http'
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router'
import {Type, provide} from 'angular2/core'
import 'rxjs/Rx'

import {App} from './app'

bootstrap(<Type>App, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,

    //enable /#/route style urls
    provide(LocationStrategy, {useClass: HashLocationStrategy})
])
