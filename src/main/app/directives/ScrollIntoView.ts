import {Directive, ElementRef} from 'angular2/core'

@Directive({
    selector: '[scroll-into-view]'
})
export class ScrollIntoView {
    constructor(el: ElementRef) {
        setTimeout(() => {
            let scrollPosition = window.scrollY + window.innerHeight
            let elementPosition = el.nativeElement.offsetTop + el.nativeElement.scrollHeight
            if (scrollPosition < elementPosition) {
                el.nativeElement.scrollIntoView(false)
            }
        })
    }
}
