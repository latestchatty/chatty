import {Directive, ElementRef} from 'angular2/core'

@Directive({
    selector: '[auto-focus]'
})
export class AutoFocus {
    constructor(el: ElementRef) {
        setTimeout(() => el.nativeElement.focus())
    }
}
