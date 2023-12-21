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
  pantallaCompleta: boolean = false;
  encendido: boolean = false;
  pantalla: any;
  elementosPantalla: any;
  btnArriba: any;
  btnAbajo: any;
  btnDerecha: any;
  btnIzquierda: any;
  btnAdelante: any;
  btnAtras: any;
  btnEncender: any;
  usando: any = false;
  //Estas variables booleanas indicarán qué componente se ve
  //dentro de la pantalla de la gameboy
  menuPrincipal: boolean = false;
  encender: boolean = false;
  apagar: boolean = false;

  constructor(private comunicationService: ComunicationServiceService) {}

  ngOnInit() {
    document.addEventListener('keydown', (event) => {
      this.accionTecla(event);
    });
    this.comunicationService.pantallaCompleta.subscribe((event: boolean) => {
      this.reposicionarPantalla(event);
    });
    this.comunicationService.fueraDeGameboy.subscribe((event: boolean) => {
      if(event){
        this.menuPrincipal = false;
        this.encender = false;
        this.encendido = false;
        this.usando = false;
      }
    })
  }
  reposicionarPantalla(event: boolean) {
    if(this.pantalla) {
      if(event){
        this.pantallaCompleta = true;
        this.pantalla.classList.remove('no-pantalla-completa');
        this.pantalla.classList.add('pantalla-completa');
      } else{
        this.pantallaCompleta = false;
        this.pantalla.classList.remove('pantalla-completa');
        this.pantalla.classList.add('no-pantalla-completa');
      }
    }
  }
  ngAfterViewInit(){
    this.btnEncender = document.querySelector('button') as HTMLButtonElement;
    this.btnEncender.addEventListener("click", () => this.encenderApagar());
    this.pantalla = document.getElementById('pantalla');
    this.elementosPantalla = document.getElementById('elementosPantalla');
    this.btnArriba = document.getElementById('arriba');
    this.btnAbajo = document.getElementById('abajo');
    this.btnDerecha = document.getElementById('derecha');
    this.btnIzquierda = document.getElementById('izquierda');
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
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'Enter' || event.key === 'Backspace') {
      this.activarAnimacion(event.key);
    }
  }

  activarAnimacion(key: string) {
    //Animaciones de los botones de la gameboy
    if(!this.pantallaCompleta){
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
      }else if (key === 'ArrowRight' || key === 'ClickArrowRight') {
        this.btnDerecha.style.opacity = "0.6";
        setTimeout(() =>{
          this.btnDerecha.style.opacity = "0";
        }, 150)
      }else if (key === 'ArrowLeft' || key === 'ClickArrowLeft') {
        this.btnIzquierda.style.opacity = "0.6";
        setTimeout(() =>{
          this.btnIzquierda.style.opacity = "0";
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
        } else if (key === 'ClickArrowLeft') {
          this.comunicationService.accion.next('ArrowLeft');
        }  else if (key === 'ClickArrowRight') {
          this.comunicationService.accion.next('ArrowRight');
        }  else if (key === 'ClickEnter') {
          this.comunicationService.accion.next('Enter');
        } else if (key === 'ClickBackspace') {
          this.comunicationService.accion.next('Backspace');
        }
      }
    }
  }
  
  encenderApagar() {
    setTimeout(() => {
      if (this.encendido && !this.encender) {
        // Animación de apagar
        this.apagar = true;
        setTimeout(() => {
          this.apagar = false;
          this.comunicationService.encendido.next(false);
          this.comunicationService.accion.next('apagado');
          this.elementosPantalla.style.opacity = '0';
          this.pantalla.style.backgroundColor = 'black';
        }, 2000);
        setTimeout(() => {
          this.encendido = false;
        },100);
      } else if(!this.encendido && !this.apagar){
        // Animación de encender
        this.elementosPantalla.style.opacity = '1';
        this.pantalla.style.backgroundColor = 'rgb(132, 153, 86)';
        this.encender = true;
        setTimeout(() => {
          this.encender = false;
          this.comunicationService.encendido.next(true);
          this.menuPrincipal = true;
          this.encendido = true;
        },3500);
      }
    }, 50);
  }  
}

