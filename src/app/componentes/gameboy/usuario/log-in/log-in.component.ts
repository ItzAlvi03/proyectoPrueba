import { Component, OnInit } from '@angular/core';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';
import { GameboyAPIService } from 'src/app/Services/Gameboy/gameboy-api.service';
import { APIServiceService } from 'src/app/Services/apiservice.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit{
  mostrarMensaje: boolean = false;
  correcto: boolean = false;
  btnIniciar: any;
  btnSalir: any;
  btnAhora: string = 'iniciar';
  usarLogIn: boolean = false;
  constructor(private comunication: ComunicationServiceService, private apiservice: GameboyAPIService){}
  
  ngOnInit(){
    this.usarLogIn = true;
    this.comunication.volverMenu.next(false);
    document.addEventListener('keydown', this.keydownListener);
    this.comunication.accion.subscribe((event: string) => {
      this.accionTeclaLogIn(event);
    });
  }
  ngAfterViewInit(){
    this.btnIniciar = document.getElementById('iniciar');
    this.btnSalir = document.getElementById('salir');
  }
  private keydownListener = (event: KeyboardEvent) => {
    this.accionTeclaLogIn(event.key);
  };

  accionTeclaLogIn(event: string) {
    if(this.usarLogIn){
      setTimeout(() => {
        if(this.comunication.encendido){
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
    this.usarLogIn = false;
    this.comunication.volverMenu.next(true);
    this.comunication.accion.next('Backspace');
  }
  iniciarSesion() {
    // Metodo que llamara a la API o BD para comprobar los campos
    this.comprobarUsuario();
  }
  comprobarUsuario() {
    const correo = document.getElementById('email') as any;
    const contrasenia = document.getElementById('password') as any;
    const nuevoUsuario = {
      correo: correo.value,
      contraseña: contrasenia.value
    };
    this.apiservice.comprobarUsuario(nuevoUsuario).subscribe(
      (results) => {
        console.log('Usuario buscado correctamente: ' + results);
      },
      (error) => {
        console.error('Error al insertar usuario:', error);
      }
    );

  }
  insertarUsuario() {
    const nuevoUsuario = {
      correo: 'prueba@prueba.com',
      nombre: 'prueba',
      contraseña: '123456'
    };
    
    this.apiservice.insertarUsuario(nuevoUsuario).subscribe(
      () => {
        console.log('Usuario insertado correctamente');
      },
      (error) => {
        console.error('Error al insertar usuario:', error);
      }
    );
  }
}
