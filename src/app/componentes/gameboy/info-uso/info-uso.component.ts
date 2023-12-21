import { Component } from '@angular/core';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';

@Component({
  selector: 'app-info-uso',
  templateUrl: './info-uso.component.html',
  styleUrls: ['./info-uso.component.css']
})
export class InfoUsoComponent {
  pantalla: any;
  MAX_OPCIONES: number = 5;
  opcion: number = 1;
  secciones: any;
  infoUso: boolean[] = [];
  bajar: boolean = false;
  subir: boolean = false;
  usarInfoUso: boolean = false;
  seccionDerecha: boolean = false;
  usuario: boolean[] = [];
  constructor(private comunication: ComunicationServiceService){}
  
  ngOnInit(){
    this.usarInfoUso = true;
    this.infoUso[0] = true;
    this.usuario[0] = true;
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
    this.agregarSeleccionado();
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
    if(this.opcion == 5){
      var num = 0;
      for(var i = 0; i < this.usuario.length; i++){
        if(this.usuario[i]){
          num = i;
          this.usuario[i] = false;
        }
      }
      if (key === 'ArrowUp') {
        if(num >= 1){
          num--;
        }
      } else{
        if(num < 2){
          num++;
        }
      }
      this.usuario[num] = true;
    } else{
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
      }
    } else if (key === 'ArrowRight') {
      if(this.opcion < this.MAX_OPCIONES){
        this.subir = false;
        this.bajar = false;
        this.infoUso[this.opcion-1] = false;
        this.opcion++;
      }
    }
    console.log(this.opcion)
    this.elegirOpcion();
  }

  elegirOpcion() {
    // Las secciones visibles son hasta 4, si quiere ir más
    // allá de 4 se oculta del 1 al 4 y aparece las siguientes
    if(this.opcion < 5)
      this.seccionDerecha = false;
    else
      this.seccionDerecha = true;

    // Buscamos y quitamos la antigua opcion seleccionada
    this.quitarSeleccionado()
    //Buscamos y agregamos como nueva opcion seleccionada a la nueva seleccionada
    this.agregarSeleccionado();
    //Vemos cual es la sección para activar o desactivar la flecha indicatoria de subir/bajar
    if(this.opcion != 3 && this.opcion != 4){
      this.bajar = true;
    }
  }
  quitarSeleccionado() {
    const antiguaOpcion = document.querySelectorAll('.seleccionadoUso') as any;
    for (var i = 0; i < antiguaOpcion.length; i++) {
      antiguaOpcion[i].classList.remove('seleccionadoUso');
      antiguaOpcion[i].classList.add('no-seleccionadoUso');
    }

  }
  agregarSeleccionado(){
    setTimeout(() => {
      const nuevaOpcion = document.querySelector('#seccionUso' + this.opcion) as HTMLElement;
      nuevaOpcion.classList.remove('no-seleccionadoUso');
      nuevaOpcion.classList.add('seleccionadoUso');
      this.infoUso[this.opcion-1] = true;
    }, 10);
  }
}
