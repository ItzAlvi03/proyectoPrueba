import { Component, OnInit } from '@angular/core';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit{
  pokedex: boolean = false;
  pokemonCard: boolean = false;
  MAX_OPCIONES: number = 2;
  opcion: number = 1;
  dentroSeccion: boolean = false;
  secciones: any;

  constructor(private comunicationService: ComunicationServiceService) {}

  ngOnInit() {
    document.addEventListener('keydown', this.keydownListener);
    this.comunicationService.accion.subscribe((event: string) => {
      this.accionTeclaClick(event);
    });
  }
  accionTeclaClick(event: string) {
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
    },100)
  }

  private keydownListener = (event: KeyboardEvent) => {
    this.accionTecla(event);
  };
  ngAfterViewInit(){
    this.secciones = document.getElementById('secciones') as HTMLElement;
  }
  //Acciones flechas
  accionTecla(event: KeyboardEvent) {
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
  entrarEnSeccion() {
    if(this.comunicationService.encendido){
      this.deshabilitarMenu();
      if(this.opcion == 1){
        this.pokedex = true;
      }else if(this.opcion == 2){
        this.pokemonCard = true;
      }
    }
  }
  habilitarMenu() {
    this.pokedex = false;
    this.pokemonCard = false;
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
