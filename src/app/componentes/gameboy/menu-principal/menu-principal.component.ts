import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit, OnDestroy{
  private destroyed$ = new Subject<void>();
  encendido: boolean = false;
  primeraVez: boolean = true;
  pokedex: boolean = false;
  combateCPU: boolean = false;
  pantallaCompleta: boolean = false;
  infoUso: boolean = false;
  usuario: boolean = false;
  MAX_OPCIONES: number = 6;
  opcion: number = 1;
  dentroSeccion: boolean = false;
  secciones: any;
  nombreUsuario: any;
  volver: boolean = true;
  mundoAbierto: boolean = false;

  constructor(private comunicationService: ComunicationServiceService) {}
  ngOnDestroy(): void {
    this.primeraVez = true;
    document.removeEventListener('keydown', this.keydownListener);
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    document.addEventListener('keydown', this.keydownListener);
    this.comunicationService.fueraDeGameboy.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((event: boolean) => {
      if(event){
        this.pokedex = false;
        this.combateCPU = false;
        this.infoUso = false;
        this.usuario = false;
        this.dentroSeccion = false;
        this.encendido = false;
        this.mundoAbierto = false;
      }
    })
    this.comunicationService.volverMenu.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((event: boolean) => {
      this.volver = event;
    });
    this.comunicationService.accion.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((event: string) => {
      this.accionTecla(event);
    });
    this.comunicationService.nombreUsuario.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((event: string) => {
      if(event !== '')
        this.nombreUsuario = event;
      else
        this.nombreUsuario = null;
    })
    this.primeraVez = false;
  }

  private keydownListener = (event: KeyboardEvent) => {
    this.accionTecla(event.key);
  };
  ngAfterViewInit(){
    this.secciones = document.getElementById('secciones') as HTMLElement;
    this.comunicationService.encendido.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((event: boolean) => {
      if(!event){
        this.encendido = false;
        this.volver = false;
        this.deshabilitarMenu();
      }else{
        this.encendido = true;
        this.volver = true;
        this.habilitarMenu();
      }
    });
  }
  //Acciones flechas
  accionTecla(event: string) {
    if(event === 'apagado'){
      this.pokedex = false;
      this.combateCPU = false;
      this.infoUso = false;
      this.usuario = false;
      this.mundoAbierto = false;
    }else{
      setTimeout(() => {
        if(this.comunicationService.encendido.value){
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
      } else if(this.opcion == 2){
        this.combateCPU = true
      } else if(this.opcion == 3){
        if(this.pantallaCompleta){
          this.pantallaCompleta = false;
          this.comunicationService.pantallaCompleta.next(false);
        } else{
          this.pantallaCompleta = true;
          this.comunicationService.pantallaCompleta.next(true);
        }
      } else if(this.opcion == 4){
        this.infoUso = true;
      } else if(this.opcion == 5){
        this.usuario = true;
      } else if(this.opcion == 6){
        this.mundoAbierto = true;
      }
    }
  }
  habilitarMenu() {
    this.pokedex = false;
    this.combateCPU = false;
    this.infoUso = false;
    this.usuario = false;
    this.mundoAbierto = false;
    this.dentroSeccion = false;
    this.secciones.style.visibility = 'visible';
    this.restablecerOpciones();
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
    // Buscamos y quitamos la antigua opcion seleccionada como seleccionado
    const antiguaOpcion = document.querySelector('.seleccionado') as HTMLElement;
    antiguaOpcion.classList.remove('seleccionado');
    antiguaOpcion.classList.add('no-seleccionado');

    // Buscamos y agregamos como nueva opcion seleccionada a la nueva seleccionada
    const nuevaOpcion = document.querySelector('#seccion' + this.opcion) as HTMLElement;
    nuevaOpcion.classList.remove('no-seleccionado');
    nuevaOpcion.classList.add('seleccionado');
  }
  restablecerOpciones(){
    // Quitamos el antiguo seleccionado y se lo ponemos al primero como al
    // iniciar la Gameboy por primera vez.
    const antiguaOpcion = document.querySelector('.seleccionado') as HTMLElement;
    antiguaOpcion.classList.remove('seleccionado');
    antiguaOpcion.classList.add('no-seleccionado');

    // Buscamos y agregamos como nueva opcion seleccionada a la primera opcion
    this.opcion = 1;
    const nuevaOpcion = document.querySelector('#seccion' + this.opcion) as HTMLElement;
    nuevaOpcion.classList.remove('no-seleccionado');
    nuevaOpcion.classList.add('seleccionado');
  }
}
