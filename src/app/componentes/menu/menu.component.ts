import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  divMenu: any;

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
  }
}
