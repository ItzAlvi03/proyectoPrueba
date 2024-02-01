import { DatePipe } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-iphone',
  templateUrl: './iphone.component.html',
  styleUrls: ['./iphone.component.css']
})
export class IphoneComponent implements AfterViewInit{
  horaLocal: string = '00:00';
  encendido: boolean = false;
  private pantalla: any;
  private apps: any;
  selectedAppIndex: number = 0;
  dentroApp: boolean = false;
  appData: any;
  pantallaData: any;

  constructor(private datePipe: DatePipe) {
    this.obtenerHoraLocal();
  }

  ngAfterViewInit(): void {
    this.pantalla = document.getElementById('pantalla');
    this.apps = document.getElementById('apps');
  }

  obtenerHoraLocal() {
    const fechaActual = new Date();
    this.horaLocal = this.datePipe.transform(fechaActual, 'HH:mm') as string;
  }

  encender() {
    this.pantalla.classList.toggle('encendida');
    if(this.encendido){
      this.apps.classList.toggle('encendida');
      this.pantalla.style.backgroundImage = 'none';
      this.pantalla.style.backgroundColor = 'black';
    } else{
      setTimeout(() =>{
        this.apps.classList.toggle('encendida');
      }, 140);
    }
    this.encendido = !this.encendido;
  }

  abrirApp(top: number, left: number, index: number): void {
    this.selectedAppIndex = index;
    if (this.selectedAppIndex !== null && this.selectedAppIndex !== undefined) {
      const string = "#app" + this.selectedAppIndex.toString() + " img"
      const app = document.querySelector(string) as HTMLImageElement;
      const pantalla = document.querySelector('#fondoPantalla') as any;
      if (app && pantalla) {
        this.appData = {
          'width': app.width,
          'height': app.height,
          'left': left,
          'top': top,
          'src': app.src
        }
        const rect2 = pantalla.getBoundingClientRect();
        this.pantallaData = {
          'width': pantalla.width,
          'height': pantalla.height,
          'left': rect2.left,
          'top': rect2.top,
        }
        this.dentroApp = true;
      }
    }

    //app?.classList.add('selected')
    //const pantalla_apps = document.getElementById('apps');
    //pantalla_apps?.classList.add('selected')
  }
}
