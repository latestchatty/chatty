import {Component} from '@angular/core'
import {ToastService} from '../services/ToastService'

import './toast.scss';

@Component({
    selector: 'toast',
    template: require('./toast.html')
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
