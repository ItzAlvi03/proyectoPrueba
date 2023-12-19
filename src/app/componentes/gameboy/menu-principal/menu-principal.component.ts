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
  usuario: boolean = false;
  MAX_OPCIONES: number = 5;
  opcion: number = 1;
  dentroSeccion: boolean = false;
  secciones: any;
  nombreUsuario: any;
  volver: boolean = true;

  constructor(private comunicationService: ComunicationServiceService) {}

  ngOnInit() {
    document.addEventListener('keydown', this.keydownListener);
    this.comunicationService.volverMenu.subscribe((event: boolean) => {
      if(!this.primeraVez){
        this.volver = event;
      }
    });
    this.comunicationService.accion.subscribe((event: string) => {
      this.accionTecla(event);
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

  private keydownListener = (event: KeyboardEvent) => {
    this.accionTecla(event.key);
  };
  ngAfterViewInit(){
    this.secciones = document.getElementById('secciones') as HTMLElement;
  }
  //Acciones flechas
  accionTecla(event: string) {
    if(event === 'apagado'){
      this.pokedex = false;
      this.infoUso = false;
      this.usuario = false;
      this.animacionApagar = false;
    }else{
      setTimeout(() => {
        if(this.comunicationService.encendido){
          if(this.volver){
            if(!this.dentroSeccion){
              if (event === 'ArrowUp' || event === 'ArrowDown') {
                this.activarAnimacion(event);
              }else if(event === 'Enter'){
                this.entrarEnSeccion();
              }
            } else{
              if(event === 'Backspace' ){
                this.habilitarMenu();
                this.comunicationService.accion.next('')
              }
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
        } else{
          this.pantallaCompleta = true;
          this.comunicationService.pantallaCompleta.next(true);
        }
      }else if(this.opcion == 4){
        this.infoUso = true;
      }else if(this.opcion == 5){
        this.usuario = true;
      }
    }
  }
  habilitarMenu() {
    this.pokedex = false;
    this.infoUso = false;
    this.usuario = false;
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
