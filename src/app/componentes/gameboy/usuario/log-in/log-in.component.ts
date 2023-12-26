import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';
import { GameboyAPIService } from 'src/app/Services/Gameboy/gameboy-api.service';
import { APIServiceService } from 'src/app/Services/apiservice.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit, OnDestroy{
  private destroyed$ = new Subject<void>();
  mensajeNoCorrecto: string = '';
  error: boolean = false;
  noCorrecto: boolean = false;
  correcto: boolean = false;
  btnIniciar: any;
  btnSalir: any;
  btnAhora: string = '';
  usarLogIn: boolean = false;
  constructor(private comunication: ComunicationServiceService, private apiservice: GameboyAPIService){}

  ngOnDestroy(): void {
    this.usarLogIn = false;
    document.removeEventListener('keydown', this.keydownListener);
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  ngOnInit(){
    this.usarLogIn = true;
    this.comunication.volverMenu.next(false);
    document.addEventListener('keydown', this.keydownListener);
    this.comunication.accion.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((event: string) => {
      this.accionTeclaLogIn(event);
    });
  }
  ngAfterViewInit(){
    this.btnIniciar = document.getElementById('iniciar');
    this.btnSalir = document.getElementById('salir');
    this.btnAhora = 'iniciar';
  }
  private keydownListener = (event: KeyboardEvent) => {
    this.accionTeclaLogIn(event.key);
  };

  accionTeclaLogIn(event: string) {
    if(this.usarLogIn){
      setTimeout(() => {
        if(this.comunication.encendido.value){
          if(event === 'Enter'){
            this.entrarEnSeccion();
          } else if(event === 'ArrowRight'){
            if(this.btnAhora === 'iniciar'){
              this.btnIniciar.classList.remove('seleccionado-log-in');
              this.btnIniciar.classList.add('no-seleccionado-log-in');
              this.btnSalir.classList.remove('no-seleccionado-log-in');
              this.btnSalir.classList.add('seleccionado-log-in');
              this.btnAhora = 'salir';
            }
          } else if(event === 'ArrowLeft'){
            if(this.btnAhora === 'salir'){
              this.btnSalir.classList.remove('seleccionado-log-in');
              this.btnSalir.classList.add('no-seleccionado-log-in');
              this.btnIniciar.classList.remove('no-seleccionado-log-in');
              this.btnIniciar.classList.add('seleccionado-log-in');
              this.btnAhora = 'iniciar';
            }
          }
        } else{
          this.ngOnDestroy();
        }
      },50);
    }
  }
  entrarEnSeccion() {
    if(this.btnAhora === 'iniciar'){
      this.iniciarSesion();
    }else{
      this.salir();
    }
  }
   salir() {
     this.comunication.volverMenu.next(true);
     this.comunication.accion.next('Backspace');
     this.ngOnDestroy();
  }
  iniciarSesion() {
    // Metodo que llamara a la API o BD para comprobar los campos
    this.comprobarUsuario();
  }
  comprobarUsuario() {
    const nombre = document.getElementById('user') as any;
    const contrasenia = document.getElementById('password') as any;
    // Comprobamos que tanto el nombre de usuario como la contraseña del
    // usuario tengan el length adecuado

    if(nombre.value.length < 18 && nombre.value.length > 0){
      if(contrasenia.value.length < 16 && contrasenia.value.length >= 6){
        // Si está todo correcto, procedemos a hacer la consulta

        const nuevoUsuario = {
          nombre: nombre.value,
          contraseña: contrasenia.value
        };
        this.apiservice.comprobarLogIn(nuevoUsuario).subscribe(
          results => {
            this.error = false;
            if (results) {
              if (results.usuario) {
                this.comunication.nombreUsuario.next(results.usuario[0]);
                this.correcto = true;
                this.noCorrecto = false;
              } else {
                this.mensajeNoCorrecto = 'Las credenciales son incorrectas.';
                this.correcto = false;
                this.noCorrecto = true;
              }
            }
          },
          error => {
            this.correcto = false;
            this.noCorrecto = false;
            this.error = true;
          }
        );
      }else{
        if(nombre.value.length > 16)
        this.mensajeNoCorrecto = 'La contraseña no puede tener más de 16 carácteres.';
        else
          this.mensajeNoCorrecto = 'La contraseña no puede tener menos de 6 caracteres.';
        this.error = false;
        this.correcto = false;
        this.noCorrecto = true;
      }
    }else{
      if(nombre.value.length > 18)
        this.mensajeNoCorrecto = 'El nombre no puede tener más de 18 carácteres.';
      else
        this.mensajeNoCorrecto = 'El nombre no puede estar vacío.';
      this.error = false;
      this.correcto = false;
      this.noCorrecto = true;
    }
  }
}
