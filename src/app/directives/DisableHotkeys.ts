import {Directive, ElementRef} from '@angular/core'
import {HotkeyService} from '../services/HotkeyService'

@Directive({
    selector: '[disable-hotkeys]'
})
export class DisableHotkeys {
    constructor(el: ElementRef, hotkeyService:HotkeyService) {
        el.nativeElement.addEventListener('focusin', () => hotkeyService.stop())
        el.nativeElement.addEventListener('focusout', () => hotkeyService.start())
    }
}
