import { Component, OnInit } from '@angular/core';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';

@Component({
  selector: 'app-combate-cpu',
  templateUrl: './combate-cpu.component.html',
  styleUrls: ['./combate-cpu.component.css']
})
export class CombateCPUComponent implements OnInit{
  usarCombateCPU: boolean = false;

  constructor(private comunication: ComunicationServiceService){}

  ngOnInit(){
    this.usarCombateCPU = true;
    document.addEventListener('keydown', this.keydownListener);
    this.comunication.accion.subscribe((event: string) => {
      this.accionTecla(event);
    });
  }

  private keydownListener = (event: KeyboardEvent) => {
    this.accionTecla(event.key);
  };

  accionTecla(event: string) {
    if(this.usarCombateCPU){
      setTimeout(() => {
        if(this.comunication.encendido.value){
            if(event === 'Backspace'){
              this.usarCombateCPU = false;
            }
        } else{
          this.usarCombateCPU = false;
        }
      },50)
    }
  }
}
