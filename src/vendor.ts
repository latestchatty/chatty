// Polyfills
import 'zone.js/dist/zone.min.js'
import 'reflect-metadata'

import {enableProdMode} from '@angular/core'

if ('production' === process.env.ENV) {
    enableProdMode()
} else {
    Error['stackTraceLimit'] = Infinity
    require('zone.js/dist/long-stack-trace-zone.js')
}

// Angular 2
import '@angular/platform-browser'
import '@angular/platform-browser-dynamic'
import '@angular/http'
import '@angular/router'
import '@angular/core'

// RxJS
import 'rxjs'

// Other vendors
import 'lodash'
