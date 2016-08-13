import {Routes, RouterModule} from '@angular/router'

import {SimpleChatty} from './chatty/SimpleChatty'
import {SplitChatty} from './chatty/SplitChatty'
import {SingleThread} from './singleThread/SingleThread'

const appRoutes:Routes = [
    {path: '', component: SimpleChatty},
    {path: 'chatty', component: SimpleChatty},
    {path: 'chatty/simple', component: SimpleChatty},
    {path: 'chatty/split', component: SplitChatty},
    {path: 'thread/:threadId', component: SingleThread},
    {path: 'thread/:threadId/:commentId', component: SingleThread}
]

export const appRoutingProviders:any[] = []

export const routing = RouterModule.forRoot(appRoutes)
