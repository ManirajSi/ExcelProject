import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import * as Prism from 'prismjs';
@Directive({
    selector: '[appHighlightCode]',
})
export class HighlightCodeDirective {
    constructor(private el: ElementRef) {}
    ngAfterViewInit() {
        Prism.highlightAllUnder(this.el.nativeElement);
    }
}
