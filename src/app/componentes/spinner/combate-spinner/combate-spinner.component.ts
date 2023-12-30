import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-combate-spinner',
  templateUrl: './combate-spinner.component.html',
  styleUrls: ['./combate-spinner.component.css']
})
export class CombateSpinnerComponent {
  @Input() mensaje: string = 'Cargando Recursos...'
}
