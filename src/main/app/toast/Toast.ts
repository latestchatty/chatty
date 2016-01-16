import {Component} from 'angular2/core'
import {ToastService} from '../services/ToastService'

@Component({
    selector: 'toast',
    templateUrl: 'app/toast/toast.html'
})
export class Toast {
    public toasts

    constructor(private toastService: ToastService){
        this.toasts = toastService.getToasts()
    }

    remove(toast) {
        this.toastService.remove(toast)
    }
}
