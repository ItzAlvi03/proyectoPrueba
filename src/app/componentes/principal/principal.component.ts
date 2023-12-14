import { Component } from '@angular/core';
import { APIServiceService } from 'src/app/Services/apiservice.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent{
  usando: boolean = false;
  divMensaje: any;
  mensaje: any;
  aparecer: any;
  imagen: any;
  width: any;
  height: any;
  area: any;
  version: any;
  localTime: any;
  constructor(private service: APIServiceService){}

  ngAfterViewInit() {
    this.divMensaje = document.getElementById('mensaje');
  }

  cambiarImg() {
    const archivo = document.getElementById('inputImg') as any
    const archivoURL = archivo.files[0]
    const objectURL = URL.createObjectURL(archivoURL)
    this.imagen = objectURL
  }
  
  generarArea() {
    if(!this.usando){
      if(this.height != null && this.width != null){
        const tamanio = {
          width: this.width,
          height: this.height
        };
          this.service.getArea(tamanio).subscribe(
            response => {
              this.area = response['Area'];
              this.mensajeConfirmacion("Se ha generado el area correctamente.");
            },
            error => {
              this.mensajeError("Error al calcular el area.");
            }
          );
      }else{
          this.mensajeError("Los valores de width y height no pueden ser nulos.");
      }
    }
  }
  mensajeError(mensaje: string) {
    this.usando = true;
    this.mensaje = mensaje;
    this.divMensaje.style.opacity = '1';
    this.divMensaje.style.right = '20px';
    this.divMensaje.style.backgroundColor = '#ff503c';
    this.divMensaje.style.color = 'white';
    //Se espera 3 seg hasta hacer la acción de esconder otra vez el mensaje
    setTimeout(() => {
        this.divMensaje.style.right = '-100%';
        this.divMensaje.style.opacity = '0';
    }, 3000);
    //Se espera 3 seg hata que se esconda del todo y pueda volver a usarse
    setTimeout(() => {
      this.usando = false;
    }, 3000);
  }

  mensajeConfirmacion(mensaje: string) {
    this.usando = true;
    this.mensaje = mensaje;
    this.divMensaje.style.opacity = '1';
    this.divMensaje.style.right = '20px';
    this.divMensaje.style.backgroundColor = '#76ff7b';
    this.divMensaje.style.color = '#0e0000';
    //Se espera 3 seg hasta hacer la acción de esconder otra vez el mensaje
    setTimeout(() => {
      this.divMensaje.style.right = '-100%';
      this.divMensaje.style.opacity = '0';
    }, 3000);
    //Se espera 3 seg hata que se esconda del todo y pueda volver a usarse
    setTimeout(() => {
      this.usando = false;
    }, 3000);
  }
}

