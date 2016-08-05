import {provide} from '@angular/core'
import {enableProdMode} from '@angular/core'
import {bootstrap} from '@angular/platform-browser-dynamic'
import {ROUTER_PROVIDERS} from '@angular/router-deprecated'
import {LocationStrategy, HashLocationStrategy} from '@angular/common'
import {HTTP_PROVIDERS} from '@angular/http'
import {App} from './app/app'

const ENV_PROVIDERS = []

if ('production' === process.env.ENV) {
  enableProdMode()
}

document.addEventListener('DOMContentLoaded', function main() {
  bootstrap(App, [
    ...ENV_PROVIDERS,
    ...HTTP_PROVIDERS,
    ...ROUTER_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy })
  ])
  .catch(err => console.error(err))
})
