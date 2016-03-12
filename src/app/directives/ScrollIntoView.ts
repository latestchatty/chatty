import {Directive, ElementRef} from 'angular2/core'

@Directive({
    selector: '[scroll-into-view]'
})
export class ScrollIntoView {
    constructor(el: ElementRef) {
        setTimeout(() => {
            let windowTop = window.scrollY + 40
            let windowBottom = window.scrollY + window.innerHeight
            let elementTop = el.nativeElement.offsetTop
            let elementBottom = elementTop +el.nativeElement.scrollHeight

            if (elementBottom > windowBottom) {
                el.nativeElement.scrollIntoView(false)
            } else if (elementTop < windowTop && elementTop > 0) {
                window.scrollBy(0, elementTop - windowTop)
            }
        })
    }
}
