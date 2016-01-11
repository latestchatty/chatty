declare var _:any
import {Component} from 'angular2/core'
import {LoadingMessages} from '../util/LoadingMessages'

@Component({
    selector: 'loading-distraction',
    templateUrl: 'app/loading/loadingDistraction.html'
})
export class LoadingDistraction {
    public loadingMessage = _.sample(LoadingMessages)
}
