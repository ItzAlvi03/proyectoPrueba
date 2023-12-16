import { Component, OnInit } from '@angular/core';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit{
  encendido: boolean = false;
  primeraVez: boolean = true;
  pokedex: boolean = false;
  animacionApagar: boolean = false;
  pantallaCompleta: boolean = false;
  infoUso: boolean = false;
  MAX_OPCIONES: number = 4;
  opcion: number = 1;
  dentroSeccion: boolean = false;
  secciones: any;

  constructor(private comunicationService: ComunicationServiceService) {}

  ngOnInit() {
    document.addEventListener('keydown', this.keydownListener);
    this.comunicationService.accion.subscribe((event: string) => {
      if(this.comunicationService.encendido)
        this.accionTeclaClick(event);
    });
    this.comunicationService.encendido.subscribe((event: boolean) => {
      if(!this.primeraVez){
        if(!event){
          this.encendido = false;
          this.deshabilitarMenu();
        }else{
          this.encendido = true;
          this.habilitarMenu();
        }
      }else{
        this.encendido = true;
      }
    });
    this.primeraVez = false;
  }
  accionTeclaClick(event: string) {
    if(event === 'apagado'){
      this.pokedex = false;
      this.infoUso = false;
      this.animacionApagar = false;
    }else{
      setTimeout(() => {
        if(this.comunicationService.encendido){
          if(!this.dentroSeccion){
            if (event === 'ArrowUp' || event === 'ArrowDown') {
              this.activarAnimacion(event);
            }else if(event === 'Enter'){
              this.entrarEnSeccion();
            }
          } else{
            if(event === 'Backspace'){
              this.habilitarMenu();
            }
          }
        }
      },50);
    }
  }

  private keydownListener = (event: KeyboardEvent) => {
    this.accionTecla(event);
  };
  ngAfterViewInit(){
    this.secciones = document.getElementById('secciones') as HTMLElement;
  }
  //Acciones flechas
  accionTecla(event: KeyboardEvent) {
    if(this.encendido){
    setTimeout(() => {
      if(this.comunicationService.encendido){
        if(!this.dentroSeccion){
          if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            event.preventDefault();
          }
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            this.activarAnimacion(event.key);
          }else if(event.key === 'Enter'){
            this.entrarEnSeccion();
          }
        } else{
          if(event.key === 'Backspace'){
            this.habilitarMenu();
          }
        }
      }
    },50);
    }
  }
  entrarEnSeccion() {
    if(this.comunicationService.encendido){
      if(this.opcion != 3)
        this.deshabilitarMenu();
      if(this.opcion == 1){
        this.pokedex = true;
      }else if(this.opcion == 2){
        //Combate pokemon
      }else if(this.opcion == 3){
        if(this.pantallaCompleta){
          this.pantallaCompleta = false;
          this.comunicationService.pantallaCompleta.next(false);
          console.log('apagado')
        } else{
          console.log('encendido')
          this.pantallaCompleta = true;
          this.comunicationService.pantallaCompleta.next(true);
        }
      }else if(this.opcion == 4){
        this.infoUso = true;
      }
    }
  }
  habilitarMenu() {
    this.pokedex = false;
    this.infoUso = false;
    this.dentroSeccion = false;
    this.secciones.style.visibility = 'visible';
  }
  deshabilitarMenu() {
    this.secciones.style.visibility = 'hidden';
    this.dentroSeccion = true;
  }

  public activarAnimacion(key: string) {
    //Animaciones de los botones de la gameboy
    if (key === 'ArrowUp') {
      if(this.opcion >= 2){
        this.opcion--;
        this.elegirOpcion();
      }
    } else if (key === 'ArrowDown') {
      if(this.opcion < this.MAX_OPCIONES){
        this.opcion++;
        this.elegirOpcion();
      }
    }
  }
  elegirOpcion() {
    //Buscamos y quitamos la antigua opcion seleccionada como seleccionado
    const antiguaOpcion = document.querySelector('.seleccionado') as HTMLElement;
    antiguaOpcion.classList.remove('seleccionado');
    antiguaOpcion.classList.add('no-seleccionado');
    //Buscamos y agregamos como nueva opcion seleccionada a la nueva seleccionada
    const nuevaOpcion = document.querySelector('#seccion' + this.opcion) as HTMLElement;
    nuevaOpcion.classList.remove('no-seleccionado');
    nuevaOpcion.classList.add('seleccionado');
  }
}
