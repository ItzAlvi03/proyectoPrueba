import { Component } from '@angular/core';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';

@Component({
  selector: 'app-info-uso',
  templateUrl: './info-uso.component.html',
  styleUrls: ['./info-uso.component.css']
})
export class InfoUsoComponent {
  pantalla: any;
  MAX_OPCIONES: number = 4;
  opcion: number = 1;
  secciones: any;
  infoUso: boolean[] = [];
  bajar: boolean = false;
  subir: boolean = false;
  usarInfoUso: boolean = false;
  constructor(private comunication: ComunicationServiceService){}
  
  ngOnInit(){
    this.usarInfoUso = true;
    this.infoUso[0] = true;
    this.bajar = true;
    document.addEventListener('keydown', this.keydownListener);
    this.comunication.accion.subscribe((event: string) => {
      this.accionTecla(event);
    });
    this.comunication.pantallaCompleta.subscribe((event: boolean) => {
      this.reposicionarPantalla(event);
    });
  }
  ngAfterViewInit(){
    this.pantalla = document.getElementById('contentInfoUso');
  }

  private keydownListener = (event: KeyboardEvent) => {
    this.accionTecla(event.key);
  }
  accionTecla(event: string) {
    if(this.usarInfoUso){
      setTimeout(() => {
        if(this.comunication.encendido.value){
          if (event === 'ArrowUp' || event === 'ArrowDown') {
            this.subirBajarAccion(event);
          }else if(event === 'ArrowRight' || event === 'ArrowLeft'){
            this.activarAnimacion(event);
          }else if(event === 'Backspace'){
              this.usarInfoUso = false;
            }
        } else {
          this.usarInfoUso = false;
        }
      },50);
    }
  }
  subirBajarAccion(key: string) {
    if (key === 'ArrowUp') {
      if(this.subir){
        this.subir = false;
        this.bajar = true;
      }
    } else if (key === 'ArrowDown') {
      if(this.bajar){
        this.subir = true;
        this.bajar = false;
      }
    }
  }

  reposicionarPantalla(event: boolean) {
    if(this.usarInfoUso){
      if(this.pantalla){
        if(event){
          this.pantalla.classList.remove('no-pantalla-completa');
          this.pantalla.classList.add('pantalla-completa');
        } else{
          this.pantalla.classList.remove('pantalla-completa');
          this.pantalla.classList.add('no-pantalla-completa');
        }
      }
    }
  }

  public activarAnimacion(key: string) {
    if (key === 'ArrowLeft') {
      if(this.opcion >= 2){
        this.subir = false;
        this.bajar = false;
        this.infoUso[this.opcion-1] = false;
        this.opcion--;
        this.elegirOpcion();
      }
    } else if (key === 'ArrowRight') {
      if(this.opcion < this.MAX_OPCIONES){
        this.subir = false;
        this.bajar = false;
        this.infoUso[this.opcion-1] = false;
        this.opcion++;
        this.elegirOpcion();
      }
    }
  }

  elegirOpcion() {
    //Buscamos y quitamos la antigua opcion seleccionada como seleccionado
    const antiguaOpcion = document.querySelector('.seleccionadoUso') as HTMLElement;
    antiguaOpcion.classList.remove('seleccionadoUso');
    antiguaOpcion.classList.add('no-seleccionadoUso');
    //Buscamos y agregamos como nueva opcion seleccionada a la nueva seleccionada
    const nuevaOpcion = document.querySelector('#seccionUso' + this.opcion) as HTMLElement;
    nuevaOpcion.classList.remove('no-seleccionadoUso');
    nuevaOpcion.classList.add('seleccionadoUso');
    this.infoUso[this.opcion-1] = true;
    //Vemos cual es la sección para activar o desactivar la flecha indicatoria de subir/bajar
    if(this.opcion != 3){
      this.bajar = true;
    }
  }
}
