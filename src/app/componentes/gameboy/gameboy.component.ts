import { Component, OnInit } from '@angular/core';
import { eventListeners } from '@popperjs/core';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';

@Component({
  selector: 'app-gameboy',
  templateUrl: './gameboy.component.html',
  styleUrls: ['./gameboy.component.css']
})
export class GameboyComponent implements OnInit{
  //Variables que se utilizan
  encendido: boolean = false;
  pantalla: any;
  elementosPantalla: any;
  btnArriba: any;
  btnAbajo: any;
  btnAdelante: any;
  btnAtras: any;
  //Estas variables booleanas indicarán qué componente se ve
  //dentro de la pantalla de la gameboy
  menuPrincipal: boolean = false;

  constructor(private comunicationService: ComunicationServiceService) {}

  ngOnInit() {
    document.addEventListener('keydown', (event) => {
      this.accionTecla(event);
    });
  }
  ngAfterViewInit(){
    this.pantalla = document.getElementById('pantalla');
    this.elementosPantalla = document.getElementById('elementosPantalla');
    this.btnArriba = document.getElementById('arriba');
    this.btnAbajo = document.getElementById('abajo');
    this.btnAdelante = document.getElementById('adelante');
    this.btnAtras = document.getElementById('atras');
  }
  //Eventos y acciones
  accionTecla(event: KeyboardEvent) {
    //Sirve para evitar el comportamiento normal de las flechas arriba y abajo
    //para que no se mueva la pantalla
    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter' || event.key === 'Backspace') {
      this.activarAnimacion(event.key);
    }
  }

  activarAnimacion(key: string) {
    //Animaciones de los botones de la gameboy
    if (key === 'ArrowUp' || key === 'ClickArrowUp') {
      this.btnArriba.style.opacity = "0.6";
      setTimeout(() =>{
        this.btnArriba.style.opacity = "0";
      }, 150)
    } else if (key === 'ArrowDown' || key === 'ClickArrowDown') {
      this.btnAbajo.style.opacity = "0.6";
      setTimeout(() =>{
        this.btnAbajo.style.opacity = "0";
      }, 150)
    }else if (key === 'Enter' || key === 'ClickEnter') {
      this.btnAdelante.style.opacity = "0.6";
      setTimeout(() =>{
        this.btnAdelante.style.opacity = "0";
      }, 150)
    }else if (key === 'Backspace' || key === 'ClickBackspace') {
      this.btnAtras.style.opacity = "0.6";
      setTimeout(() =>{
        this.btnAtras.style.opacity = "0";
      }, 150)
    }
    //Acciones en caso de que se haga click en los
    if(this.encendido){
      if (key === 'ClickArrowUp') {
        this.comunicationService.accion.next('ArrowUp');
      } else if (key === 'ClickArrowDown') {
        this.comunicationService.accion.next('ArrowDown');
      } else if (key === 'ClickEnter') {
        this.comunicationService.accion.next('Enter');
      } else if (key === 'ClickBackspace') {
        this.comunicationService.accion.next('Backspace');
      }
    }
  }
  
  encenderApagar() {
    if(this.encendido){
      setTimeout(() => {
        this.menuPrincipal = false;
      }, 400);
      this.elementosPantalla.style.opacity = '0';
      this.pantalla.style.backgroundColor = 'black';
      setTimeout(() => {
        this.menuPrincipal = false;
      }, 400);
      this.comunicationService.encendido.next(false);
      this.encendido = false;
    }else{
      this.pantalla.style.backgroundColor = 'rgb(132, 153, 86)';
      setTimeout(() => {
        this.menuPrincipal = true;
        this.elementosPantalla.style.opacity = '1';
      }, 400);
      this.comunicationService.encendido.next(true);
      this.encendido = true;
    }
  }
}

