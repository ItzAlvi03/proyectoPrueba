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

  agrandar(index: number): void {
    //this.selectedAppIndex = index;
    //const app = document.getElementById(this.selectedAppIndex.toString());
    //app?.classList.add('selected')
    //const pantalla_apps = document.getElementById('apps');
    //pantalla_apps?.classList.add('selected')
  }
}
