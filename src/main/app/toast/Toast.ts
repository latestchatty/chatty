import {Component, OnInit} from 'angular2/core'
import {ToastService} from '../services/ToastService'

@Component({
    selector: 'toast',
    templateUrl: 'app/toast/toast.html'
})
export class Toast implements OnInit {
    public toasts

    constructor(private toastService: ToastService){
    }

    ngOnInit(){
        this.toasts = this.toastService.getToasts()
    }
}
