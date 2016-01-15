declare var _:any
import {Injectable} from 'angular2/core'

@Injectable()
export class ToastService {
    private toasts = []

    getToasts() {
        return this.toasts
    }

    create(toast, timeout = 5000) {
        this.toasts.push(toast)

        setTimeout(() => {
            this.remove(toast)
        }, timeout)
    }

    remove(toast){
        _.pull(this.toasts, toast)
    }
}
