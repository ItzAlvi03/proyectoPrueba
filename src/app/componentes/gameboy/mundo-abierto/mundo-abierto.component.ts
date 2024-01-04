import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LogicaService } from 'src/app/Services/Gameboy/CombatePokemon/logica.service';
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

export class MundoAbiertoComponent implements AfterViewInit, OnInit {
  private destroyed$ = new Subject<void>();
  private canvas: any;
  private ctx!: CanvasRenderingContext2D;
  private playerX: number = 0;
  private playerY: number = 0;
  private backgroundX: number = -90;
  private backgroundY: number = -107;
  private collisions!: Collisions[];
  private pokemonAreas!: Collisions[];
  private collisionW: number = 18;
  private collisionH: number = 18;
  private filas: number = 40;
  private columnas: number = 70;
  private mapa: any;
  private player: any;
  private array: any;
  private usarMundoAbierto: boolean = false;
  encuentro: boolean = false;

  constructor(private service: ArrayJsonService, private comunication: ComunicationServiceService, private logica: LogicaService) {}

  ngOnInit(): void {
    this.comunication.mundoAbierto.next(true);
    this.comunication.volverMenu.next(false);
    this.comunication.finCombate.next(false);
  }

  ngOnDestroy(): void {
    this.usarMundoAbierto = false;
    document.removeEventListener('keydown', this.keydownListener);
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {
    // Instanciando variables
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.playerX = this.canvas.width / 2;
    this.playerY = this.canvas.height / 2;
    this.collisions = [];
    this.array = this.service.getCollisions();
    this.pokemonAreas = [];
    this.mapa = new Image();
    this.mapa.src = '../../../../assets/images/PokemonStyleGameMap.png';
    this.player = new Image();
    this.player.src = '../../../../assets/images/character.png';

    // Metodos para empezar a iniciar el mundo abierto
    this.collisions = this.getCollisions();
    this.getPokemonAreas();
    this.drawMap();
    this.drawPlayer();

    // Acciones del teclado y de la cruzeta de la Gameboy
    document.addEventListener('keydown', this.keydownListener);
    this.comunication.finCombate.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((event: boolean) => {
      if(event){
        this.usarMundoAbierto = true;
        this.encuentro = false;
      }
    })
    this.comunication.accion.pipe(
      takeUntil(this.destroyed$)
      ).subscribe((event: string) => {
        this.handleInput(event);
      });

    // Iniciar el primer frame y permitir al usuario moverse
    this.usarMundoAbierto = true;
    setTimeout(() => {
      this.nuevoFrame();
    }, 50);
  }

  private keydownListener = (event: KeyboardEvent) => {
    event.preventDefault();
    this.handleInput(event.key);
  };

  getCollisions() {
    let i = 0;
    let num = 0;
    var colisiones = [];
  
    for (let fila = 0; fila < this.filas; fila++) {
      for (let columna = 0; columna < this.columnas; columna++) {
        if (this.array[i] !== 0) {
          
          const x = columna * this.collisionW - (this.collisionW  * 5);
          const y = fila * this.collisionH - (this.collisionH * 6.2);
  
          colisiones[num] = new Collisions(x, y, this.collisionW, this.collisionH);
          num++;
        }
        i++;
      }
    }
    return colisiones;
  }

  getPokemonAreas() {
    this.array = this.service.getPokemonArea();
    this.pokemonAreas = this.getCollisions();
  }

  drawMap(): void {
    // Dibuja el mapa y las áreas de colisión en rojo
    this.ctx.drawImage(this.mapa, this.backgroundX, this.backgroundY);

    // Áreas de colisión en rojo
    //this.ctx.fillStyle = 'red';
    //for(let i = 0; i < this.pokemonAreas.length; i++){
    //  this.ctx.fillRect(this.pokemonAreas[i].x, this.pokemonAreas[i].y, this.pokemonAreas[i].width, this.pokemonAreas[i].height);
    //}
  }

  drawPlayer(): void {
    // Dibuja el jugador
    this.ctx.drawImage(this.player, this.playerX, this.playerY);
  }

  handleInput(event: any): void {
    // Maneja la entrada del teclado para mover al jugador
    if(this.comunication.encendido.value && this.usarMundoAbierto){
      switch (event) {
        case 'ArrowLeft':
          this.movePlayer(-6, 0);
          break;
        case 'ArrowRight':
          this.movePlayer(6, 0);
          break;
        case 'ArrowUp':
          this.movePlayer(0, -6);
          break;
        case 'ArrowDown':
          this.movePlayer(0, 6);
          break;
      }
    }
  }

  movePlayer(dx: number, dy: number): void {
    // Mueve al jugador
    this.backgroundX -= dx;
    this.backgroundY -= dy;
    for (let i = 0; i < this.collisions.length; i++) {
      this.collisions[i].x -= dx;
      this.collisions[i].y -= dy;
    }
    for (let i = 0; i < this.pokemonAreas.length; i++) {
      this.pokemonAreas[i].x -= dx;
      this.pokemonAreas[i].y -= dy;
    }
    
    if (this.checkCollisions()) {
      // Revierte la posición del jugador en lugar de la del fondo
      this.backgroundX += dx;
      this.backgroundY += dy;
      for (let i = 0; i < this.collisions.length; i++) {
        this.collisions[i].x += dx;
        this.collisions[i].y += dy;
      }
      for (let i = 0; i < this.pokemonAreas.length; i++) {
        this.pokemonAreas[i].x += dx;
        this.pokemonAreas[i].y += dy;
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
    for (let i = 0; i < this.pokemonAreas.length; i++) {
      if (
        this.playerX < this.pokemonAreas[i].x + this.pokemonAreas[i].width - 10 &&
        this.playerX + this.player.width - 10 > this.pokemonAreas[i].x &&
        this.playerY < this.pokemonAreas[i].y + this.pokemonAreas[i].height - 6 &&
        this.playerY + this.player.height - 6 > this.pokemonAreas[i].y
      ) {
        // Dentro del area detectado
        var encuentro = this.logica.encontrarPokemon();
        console.log('dentro del area')
        if(encuentro){
          this.usarMundoAbierto = false;
          setTimeout(() => {
            this.encuentro = true;
            console.log('Pokemon salvaje encontrado!!')
          }, 50);
          // Logica de animaciones y demás cosas
        }
      }
    }

    return colision;
  }

   nuevoFrame(): void{
    // Metodos para mostrar un nuevo Frame o Imagen
    // del estado actual del jugador
    this.clearCanvas();
    this.drawMap();
    this.drawPlayer();
   }

  clearCanvas(): void {
    // Limpia el lienzo
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
