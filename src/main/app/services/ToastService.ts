declare var _:any
import {Injectable} from 'angular2/core'

@Injectable()
export class ToastService {
    private toasts = []

    getToasts() {
        return this.toasts
    }

    info(message:String, timeout = 5000) {
        this.show(message, 'info', timeout)
    }

    warn(message:String, timeout = 5000) {
        this.show(message, 'warn', timeout)
    }

    remove(toast) {
        _.pull(this.toasts, toast)
    }

    private show(message:String, theme:String = 'warn', timeout = 5000) {
        let toast = {message, theme}
        this.toasts.push(toast)

        setTimeout(() => this.remove(toast), timeout)
    }
}
