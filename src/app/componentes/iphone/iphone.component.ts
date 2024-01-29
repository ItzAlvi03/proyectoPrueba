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

  constructor(private datePipe: DatePipe) {
    this.obtenerHoraLocal();
  }
  ngAfterViewInit(): void {
    this.pantalla = document.getElementById('pantalla');
  }

  obtenerHoraLocal() {
    const fechaActual = new Date();
    this.horaLocal = this.datePipe.transform(fechaActual, 'HH:mm') as string;
  }
  encender() {
    this.pantalla.classList.toggle('encendida');
    if(this.encendido){
      this.pantalla.style.backgroundImage = 'none';
      this.pantalla.style.backgroundColor = 'black';
    }
    this.encendido = !this.encendido;
  }
}
