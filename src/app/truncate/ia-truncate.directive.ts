import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appIATruncate]'
})
export class IATruncateDirective {
  @Input() set appIATruncate(value: string) {
    this.truncateText(value);
  }

  @Input() maxLength: number = 20;

  @Input() set length(value: number) {
    this.maxLength = value;
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('maxLength' in changes) {
       this.truncateText(this.el.nativeElement.textContent);
    }
 } 

 private truncateText(text: string): void {
  if (text && this.maxLength) {
    const extensionMatch = text.match(/\.\w+$/);
    const extension = extensionMatch ? extensionMatch[0] : '';

    const truncatedText = text.length > this.maxLength
      ? text.substring(0, this.maxLength - extension.length) + extension
      : text;

    this.renderer.setProperty(this.el.nativeElement, 'textContent', truncatedText);
  }
}
}
