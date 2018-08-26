import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpModule} from '@angular/http'
import {App} from './app.ts'
import {routing, appRoutingProviders} from './routing'
import {FormsModule} from '@angular/forms'

import {SimpleChatty} from './chatty/SimpleChatty'
import {SplitChatty} from './chatty/SplitChatty'
import {SingleThread} from './singleThread/SingleThread'

@NgModule({
    declarations: [
        App,
        SimpleChatty,
        SplitChatty,
        SingleThread
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [App],
})
export class AppModule {
}
