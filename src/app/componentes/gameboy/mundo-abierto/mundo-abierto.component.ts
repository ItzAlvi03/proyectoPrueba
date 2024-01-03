import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';

class Sprite {
  position = { x: 0, y: 0 };
  image;
  constructor( position: any, velocity: any, image: any) {
    this.position = position;
    this.image = image;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.position.x, this.position.y);
  }
}

@Component({
  selector: 'app-mundo-abierto',
  templateUrl: './mundo-abierto.component.html',
  styleUrls: ['./mundo-abierto.component.css']
})
export class MundoAbiertoComponent implements AfterViewInit{
  private destroyed$ = new Subject<void>();
  private canvas: any;
  context: any;
  private image: any;
  private player: any;
  private lastKey = "";
  private keys = {
    ArrowUp: {
      pressed: false
    },
    ArrowLeft: {
      pressed: false
    },
    ArrowDown: {
      pressed: false
    },
    ArrowRight: {
      pressed: false
    }
  };
  private background!: Sprite;

  constructor(private comunicationService: ComunicationServiceService){}

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keydownListener);
    document.removeEventListener('keyup', this.keyupListener);
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.image = new Image();
    this.image.src = '../../../../assets/images/pruebaMapa.png';
    this.player = new Image();
    this.player.src = '../../../../assets/images/character.png';

    document.addEventListener('keydown', this.keydownListener);
    document.addEventListener('keyup', this.keyupListener);
    this.comunicationService.accion.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((event: string) => {
      this.accionTecla(event);
    });
    const position = {
      x: -20,
      y: -70
    };
    this.background = new Sprite (position,0,this.image);
    this.animate()
  }

  private keydownListener = (event: KeyboardEvent) => {
    this.accionTecla(event.key);
  };
  private keyupListener = (event: KeyboardEvent) => {
    this.keyUp(event.key);
  }

  accionTecla(event: string) {
    setTimeout(() => {
      if(this.comunicationService.encendido.value){
        switch (event){
        case 'ArrowUp':
          this.keys.ArrowUp.pressed = true;
          this.lastKey = 'ArrowUp';
          break;
        case 'ArrowLeft':
          this.keys.ArrowLeft.pressed = true;
          this.lastKey = 'ArrowLeft';
          break;
        case 'ArrowDown':
          this.keys.ArrowDown.pressed = true;
          this.lastKey = 'ArrowDown';
          break;
        case 'ArrowRight':
          this.keys.ArrowRight.pressed = true;
          this.lastKey = 'ArrowRight';
          break;
        }
      } else{
        this.ngOnDestroy();
      }
    },50);
  }

  keyUp(event: string){
    setTimeout(() => {
      if(this.comunicationService.encendido.value){
        switch (event){
        case 'ArrowUp':
          this.keys.ArrowUp.pressed = false;
          break;
        case 'ArrowLeft':
          this.keys.ArrowLeft.pressed = false;
          break;
        case 'ArrowDown':
          this.keys.ArrowDown.pressed = false;
          break;
        case 'ArrowRight':
          this.keys.ArrowRight.pressed = false;
          break;
        }
      } else{
        this.ngOnDestroy();
      }
    },50);
  }

  animate(): any{
    window.requestAnimationFrame(() => this.animate());
    this.background.draw(this.context);
    this.context.drawImage(this.player,
      0,
      0,
      this.player.width,
      this.player.height,
      this.canvas.width / 2 - this.player.width / 2,
      this.canvas.height / 2 - this.player.height / 2,
      this.player.width,
      this.player.height
    );
  
    if (this.keys.ArrowUp.pressed && this.lastKey === 'ArrowUp') this.background.position.y += 1;
    if (this.keys.ArrowDown.pressed && this.lastKey === 'ArrowDown') this.background.position.y -= 1;
    if (this.keys.ArrowLeft.pressed && this.lastKey === 'ArrowLeft') this.background.position.x += 1;
    if (this.keys.ArrowRight.pressed && this.lastKey === 'ArrowRight') this.background.position.x -= 1;
  }
}
