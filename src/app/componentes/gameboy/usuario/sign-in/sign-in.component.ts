import { Component } from '@angular/core';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';
import { GameboyAPIService } from 'src/app/Services/Gameboy/gameboy-api.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  cuentaUsuario: any;
  error: boolean = false;
  noCorrecto: boolean = false;
  correcto: boolean = false;
  btnRegistrar: any;
  btnSalir: any;
  btnAhora: string = '';
  usarSignIn: boolean = false;
  mensajeNoCorrecto: string = '';
  constructor(private comunication: ComunicationServiceService, private apiservice: GameboyAPIService){}
  
  ngOnInit(){
    this.usarSignIn = true;
    this.comunication.volverMenu.next(false);
    document.addEventListener('keydown', this.keydownListener);
    this.comunication.accion.subscribe((event: string) => {
      this.accionTeclaSignIn(event);
    });
  }
  ngAfterViewInit(){
    this.btnRegistrar = document.getElementById('registrar');
    this.btnSalir = document.getElementById('salir');
    this.btnAhora = 'registrar';
  }
  private keydownListener = (event: KeyboardEvent) => {
    this.accionTeclaSignIn(event.key);
  };

  accionTeclaSignIn(event: string) {
    if(this.usarSignIn){
      setTimeout(() => {
        if(this.comunication.encendido.value){
          if(event === 'Enter'){
            this.entrarEnSeccion();
          } else if(event === 'ArrowRight'){
            if(this.btnAhora === 'registrar'){
              this.btnRegistrar.classList.remove('seleccionado-sign-in');
              this.btnRegistrar.classList.add('no-seleccionado-sign-in');
              this.btnSalir.classList.remove('no-seleccionado-sign-in');
              this.btnSalir.classList.add('seleccionado-sign-in');
              this.btnAhora = 'salir';
            }
          } else if(event === 'ArrowLeft'){
            if(this.btnAhora === 'salir'){
              this.btnSalir.classList.remove('seleccionado-sign-in');
              this.btnSalir.classList.add('no-seleccionado-sign-in');
              this.btnRegistrar.classList.remove('no-seleccionado-sign-in');
              this.btnRegistrar.classList.add('seleccionado-sign-in');
              this.btnAhora = 'registrar';
            }
          }
        } else{
          this.usarSignIn = false;
        }
      },50);
    }
  }
  entrarEnSeccion() {
    if(this.cuentaUsuario){
      this.crearUsuario();
    }else{
      if(this.btnAhora === 'registrar'){
        this.registrarUsuario();
      }else{
        this.salir();
      }
    }
  }
   salir() {
    this.usarSignIn = false;
    this.comunication.volverMenu.next(true);
    this.comunication.accion.next('Backspace');
  }
  registrarUsuario() {
    // Metodo que llamara a la API o BD para comprobar los campos
    // y si no existen se podrá registrar
    this.comprobarUsuario();
  }
  comprobarUsuario() {
    const nombre = document.getElementById('user') as any;
    const contrasenia = document.getElementById('password') as any;
    // Comprobamos que tanto el nombre de usuario como la contraseña del
    // usuario tengan el length adecuado

    if(nombre.value.length < 18){
      if(contrasenia.value.length < 16){
        // Si está todo correcto, procedemos a hacer la consulta

        const nuevoUsuario = {
          nombre: nombre.value,
          contraseña: contrasenia.value
        };
        this.apiservice.comprobarUsuario(nuevoUsuario).subscribe(
          results => {
            this.error = false;
            this.correcto = false;
            try {
              if(results[0].nombre){
                this.mensajeNoCorrecto = 'La cuenta ya existe';
                this.noCorrecto = true;
              }
            } catch (error) {
              this.cuentaUsuario = nuevoUsuario;
              this.noCorrecto = false;
            }
          },
          error => {
            this.correcto = false;
            this.noCorrecto = false;
            this.error = true;
          }
        );
      }else{
        this.mensajeNoCorrecto = 'La contraseña no puede tener más de 16 carácteres.';
        this.error = false;
        this.correcto = false;
        this.noCorrecto = true;
      }
    }else{
      this.mensajeNoCorrecto = 'El nombre no puede tener más de 18 carácteres.';
      this.error = false;
      this.correcto = false;
      this.noCorrecto = true;
    }
  }
  crearUsuario() {
    const correo = document.getElementById('email') as any;
    if(correo.value.length > 30){
      this.mensajeNoCorrecto = 'El correo no puede tener más de 30 carácteres';
      this.noCorrecto = true;
      this.correcto = false;
      this.error = false;
    }else{
      const nuevoUsuario = {
        correo: correo.value,
        nombre: this.cuentaUsuario.nombre,
        contraseña: this.cuentaUsuario.contraseña
      }
      this.apiservice.insertarUsuario(nuevoUsuario).subscribe(
        results => {
          this.correcto = true;
          this.error = false;
          this.noCorrecto = false;
          this.btnAhora = 'salir';
          this.cuentaUsuario = null;
        },
        error => {
          this.error = true;
          this.correcto = false;
          this.noCorrecto = false;
          this.cuentaUsuario = null;
        }
      );
    }
  }

}
