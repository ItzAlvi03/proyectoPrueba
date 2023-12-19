import { Component, OnInit } from '@angular/core';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';
import { GameboyAPIService } from 'src/app/Services/Gameboy/gameboy-api.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit{
  logIn: boolean = false;
  signIn: boolean = false;
  opcion: number = 1;
  MAX_OPCIONES: number = 2;
  utilizando: boolean = false;
  dentroSeccionUsuario: boolean = false;
  constructor(private comunicationService: ComunicationServiceService) {}
  
  ngOnInit(){
    this.comunicationService.volverMenu.next(true);
    document.addEventListener('keydown', this.keydownListener);
    this.comunicationService.accion.subscribe((event: string) => {
      if(this.comunicationService.encendido){
        if(!this.dentroSeccionUsuario){
          if(this.utilizando){
            this.accionTecla(event);
          }
        }
      }
    });
    this.utilizando = true;
  }

  private keydownListener = (event: KeyboardEvent) => {
    if(this.comunicationService.encendido){
      if(!this.dentroSeccionUsuario){
        if(this.utilizando){
          this.accionTecla(event.key);
        }
      }
    }
  }

  accionTecla(event: string) {
    setTimeout(() => {
      if(this.comunicationService.encendido){
          if (event === 'ArrowUp' || event === 'ArrowDown') {
            this.subirBajarAccion(event);
          } else if(event === 'Enter'){
            this.entrarSeccion();
          } else if(event === 'Backspace'){
            this.utilizando = false;
          }
      }
    },100)
  }

  entrarSeccion() {
    if(this.opcion == 1){
      this.logIn = true;
      this.dentroSeccionUsuario = true;
    } else {
      this.signIn = true;
      this.dentroSeccionUsuario = true;
    }
  }

  subirBajarAccion(key: string) {
    if(key == 'ArrowUp'){
      if(this.opcion > 1){
        this.opcion--;
        this.elegirOpcion();
      }
    } else{
      if(this.opcion < this.MAX_OPCIONES){
        this.opcion++;
        this.elegirOpcion();
      }
    }
  }

  elegirOpcion() {
    //Buscamos y quitamos la antigua opcion seleccionada como seleccionado
    const antiguaOpcion = document.querySelector('.seleccionado-usuario') as HTMLElement;
    antiguaOpcion.classList.remove('seleccionado-usuario');
    antiguaOpcion.classList.add('no-seleccionado-usuario');
    //Buscamos y agregamos como nueva opcion seleccionada a la nueva seleccionada
    const nuevaOpcion = document.querySelector('#usuario' + this.opcion) as HTMLElement;
    nuevaOpcion.classList.remove('no-seleccionado-usuario');
    nuevaOpcion.classList.add('seleccionado-usuario');
  }
}
