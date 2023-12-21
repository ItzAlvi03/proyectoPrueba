import { Component } from '@angular/core';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  divMenu: any;
  constructor(private comunicator: ComunicationServiceService){}

  ngAfterViewInit(){
    this.divMenu = document.getElementById('opciones')
  }
  abrirMenu() {
    this.divMenu.style.right = '0';
    this.divMenu.style.width = '100%'
  }

  cerrarMenu() {
    this.divMenu.style.right = '-100%';
    this.divMenu.style.width = '0'
    this.comunicator.encendido.next(false);
    this.comunicator.accion.next('apagado');
    this.comunicator.fueraDeGameboy.next(true);
  }
}
