import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { APIServiceService } from 'src/app/Services/apiservice.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements AfterViewInit{
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
  menu: boolean = false;

  constructor(private service: APIServiceService, private router: Router){}
  
  ngAfterViewInit() {
    this.divMensaje = document.getElementById('mensaje');
  }

  cambiarImg() {
    const archivo = document.getElementById('inputImg') as any
    const archivoURL = archivo.files[0]
    const objectURL = URL.createObjectURL(archivoURL)
    this.imagen = objectURL
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

  entrarAnimacion(route: string, num: number) {
    const img = document.querySelector('.img-' + num);
    const card = document.querySelector('.card-' + num) as any;
    card.style.zIndex = '3';
    card?.classList.add('open-card');
    setTimeout(() => {
      img?.classList.add('open');
      setTimeout(() => {
        this.router.navigate([route]);
      }, 300)
    }, 300);
  }

  mostrarInfo(num: number) {
    const icon = document.querySelectorAll('.icono');
    const infoContainer = document.querySelectorAll('.info-container');
    if (num >= 0 && num < icon.length) {
        const i = icon[num];
        const iconAbierto = document.querySelector('.rotated');
        const text = document.querySelector('.active');

        if(iconAbierto === i){
          i.classList.remove('rotated');
          text?.classList.toggle('active');
        } else{
          if (iconAbierto) iconAbierto.classList.toggle('rotated');
          if(text) text.classList.toggle('active');

          i.classList.toggle('rotated');
          infoContainer[num].classList.toggle('active');
        }
    }
  }
}