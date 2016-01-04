import {Directive, ElementRef} from 'angular2/core'

@Directive({
    selector: '[auto-focus]'
})
export class AutoFocus {
    constructor(el: ElementRef) {
        el.nativeElement.focus()
    }
}
