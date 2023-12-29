import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCombatePokemon]'
})
export class CombatePokemonDirective {
  @Input() set appCombatePokemon(value: string) {
    this.truncateText(value);
  }

  @Input() maxLength: number = 12; 

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private truncateText(text: string): void {
    const truncatedText = text.length > this.maxLength
      ? text.substring(0, this.maxLength) + '...'
      : text;

    this.renderer.setProperty(this.el.nativeElement, 'textContent', truncatedText);
  }
}
