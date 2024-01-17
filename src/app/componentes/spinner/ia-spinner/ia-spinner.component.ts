import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ia-spinner',
  templateUrl: './ia-spinner.component.html',
  styleUrls: ['./ia-spinner.component.css']
})
export class IaSpinnerComponent {
  @Input() mensaje: string = 'Cargando Recursos...'
}
