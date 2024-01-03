import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ArrayJsonService } from 'src/app/Services/Gameboy/MundoAbierto/array-json.service';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';

class Collisions {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x:number,y:number, width:number, height:number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

@Component({
  selector: 'app-mundo-abierto',
  templateUrl: './mundo-abierto.component.html',
  styleUrls: ['./mundo-abierto.component.css']
})

export class MundoAbiertoComponent implements AfterViewInit {
  canvas: any;
  ctx!: CanvasRenderingContext2D;
  playerX: number = 0;
  playerY: number = 0;
  backgroundX: number = -90;
  backgroundY: number = -107;
  collisions!: Collisions[];
  collisionW: number = 18;
  collisionH: number = 18;
  filas: number = 40;
  columnas: number = 70;
  mapa: any;
  player: any;
  array: any;

  constructor(private service: ArrayJsonService) {}

  ngAfterViewInit(): void {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.playerX = this.canvas.width / 2;
    this.playerY = this.canvas.height / 2;
    this.collisions = [];
    this.array = this.service.getCollisions();
    //this.collisions[0] = new Collisions(100,190,120,80);
    //this.collisions[1] = new Collisions(300,200,80,120);
    this.mapa = new Image();
    this.mapa.src = '../../../../assets/images/PokemonStyleGameMap.png';
    this.player = new Image();
    this.player.src = '../../../../assets/images/character.png';
    this.getCollisions();
    this.drawMap();
    this.drawPlayer();
    this.handleInput();
    setTimeout(() => {
      this.nuevoFrame();
    }, 50);
  }

  getCollisions() {
    let i = 0;
    let num = 0;
  
    for (let fila = 0; fila < this.filas; fila++) {
      for (let columna = 0; columna < this.columnas; columna++) {
        if (this.array[i] === 1025) {
          
          const x = columna * this.collisionW - (this.collisionW  * 5);
          const y = fila * this.collisionH - (this.collisionH * 6.2);
  
          this.collisions[num] = new Collisions(x, y, this.collisionW, this.collisionH);
          num++;
        }
        i++;
      }
    }

  }

  drawMap(): void {
    // Dibuja el mapa y las áreas de colisión en rojo
    this.ctx.drawImage(this.mapa, this.backgroundX, this.backgroundY);

    // Áreas de colisión en rojo
    //this.ctx.fillStyle = 'red';
    // Áreas de colisión transparentes
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.0)';
    for(let i = 0; i < this.collisions.length; i++){
      this.ctx.fillRect(this.collisions[i].x, this.collisions[i].y, this.collisions[i].width, this.collisions[i].height);
    }
  }

  drawPlayer(): void {
    // Dibuja el jugador
    this.ctx.drawImage(this.player, this.playerX, this.playerY);

  }

  handleInput(): void {
    // Maneja la entrada del teclado para mover al jugador
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.movePlayer(-5, 0);
          break;
        case 'ArrowRight':
          this.movePlayer(5, 0);
          break;
        case 'ArrowUp':
          this.movePlayer(0, -5);
          break;
        case 'ArrowDown':
          this.movePlayer(0, 5);
          break;
      }
    });
  }

  movePlayer(dx: number, dy: number): void {
    // Mueve al jugador
    this.backgroundX -= dx;
    this.backgroundY -= dy;
    for (let i = 0; i < this.collisions.length; i++) {
      this.collisions[i].x -= dx;
      this.collisions[i].y -= dy;
    }
    
    if (this.checkCollisions()) {
      // Revierte la posición del jugador en lugar de la del fondo
      this.backgroundX += dx;
      this.backgroundY += dy;
      for (let i = 0; i < this.collisions.length; i++) {
        this.collisions[i].x += dx;
        this.collisions[i].y += dy;
      }
    }

    this.nuevoFrame();
  }
  

  checkCollisions(): boolean {
    // Verifica las colisiones con las áreas rojas si hay colision devuelve true
    let colision = false;
    for (let i = 0; i < this.collisions.length; i++) {
      if (
        this.playerX < this.collisions[i].x + this.collisions[i].width &&
        this.playerX + this.player.width > this.collisions[i].x &&
        this.playerY < this.collisions[i].y + this.collisions[i].height &&
        this.playerY + this.player.height > this.collisions[i].y
      ) {
        // Colisión detectada
        colision = true;
      }
    }

    return colision;
  }
   nuevoFrame(): void{
    this.clearCanvas();
    this.drawMap();
    this.drawPlayer();
   }

  clearCanvas(): void {
    // Limpia el lienzo
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
