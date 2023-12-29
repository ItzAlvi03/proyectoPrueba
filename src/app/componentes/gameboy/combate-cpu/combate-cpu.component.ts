import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LogicaService } from 'src/app/Services/Gameboy/CombatePokemon/logica.service';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';
import { PokedexService } from 'src/app/Services/Gameboy/pokedex.service';
import { CombatePokemonDirective } from 'src/app/truncate/combate-pokemon.directive';

@Component({
  selector: 'app-combate-cpu',
  templateUrl: './combate-cpu.component.html',
  styleUrls: ['./combate-cpu.component.css']
})
export class CombateCPUComponent implements OnInit, OnDestroy{
  private destroyed$ = new Subject<void>();
  private usarCombateCPU: boolean = false;
  private MAX_POKEMON = 649 as number;
  pokemon!: any [];
  cargado: boolean = false;
  private barraSaludUser: any;
  private barraSaludCPU: any;
  hp!: any[];
  maxHp!: any[];
  menu: boolean = false;
  private contadorError: number = 0;
  private arriba: boolean = true;
  private numSeccion: number = 1;
  dentroSeccion: boolean = false;
  seccionMenu: number = 1;
  seccionLuchar: boolean = false;
  seccionPokemon: boolean = false;
  seccionBolsa: boolean = false;
  mensaje: string = "";
  
  constructor(private comunication: ComunicationServiceService, private pokedex: PokedexService, private logica: LogicaService){}

  ngOnDestroy(): void {
    this.cargado = false;
    this.usarCombateCPU = false;
    document.removeEventListener('keydown', this.keydownListener);
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(){
    this.usarCombateCPU = true;
    document.addEventListener('keydown', this.keydownListener);
    this.comunication.accion.pipe(
      takeUntil(this.destroyed$)
      ).subscribe((event: string) => {
        this.accionTecla(event);
      });
    }

    async ngAfterViewInit(){
      await this.generarPokemon();
      this.cargado = true;
      this.comunication.volverMenu.next(false);
      setTimeout(() => {
        this.barraSaludUser = document.querySelector('#salud1') as any;
        this.barraSaludCPU = document.querySelector('#salud2') as any;
      },50);
      this.menu = true;
    }

    resize() {
      var imagenes = document.querySelectorAll('.imgClase');
      
      imagenes.forEach((imagen: any) => {
        // Obtén el ancho natural de cada imagen
        var anchoImagen = imagen.naturalWidth;
        
        // Ajusta el ancho de la imagen en función de su tamaño
        if (anchoImagen >= 160) {
          imagen.style.width = '100%';
        } else if (anchoImagen >= 140) {
          imagen.style.width = '90%';
        } else if (anchoImagen >= 130) {
          imagen.style.width = '85%';
        } else if (anchoImagen >= 120) {
          imagen.style.width = '80%';
        } else if (anchoImagen >= 110) {
          imagen.style.width = '75%';
        } else if (anchoImagen >= 100) {
          imagen.style.width = '70%';
        } else if (anchoImagen >= 90) {
          imagen.style.width = '65%';
        } else if (anchoImagen >= 80) {
          imagen.style.width = '60%';
        } else if (anchoImagen >= 75) {
          imagen.style.width = '55%';
        } else if (anchoImagen >= 70) {
          imagen.style.width = '50%';
        } else if (anchoImagen >= 65) {
          imagen.style.width = '45%';
        } else if (anchoImagen >= 60) {
          imagen.style.width = '40%';
        } else if (anchoImagen >= 45) {
          imagen.style.width = '35%';
        } else{
          imagen.style.width = '30%';
        }
      });
    }

    async generarPokemon() {
      this.hp = [];
      this.maxHp = [];
      this.pokemon = [];
      
    for (var i = 0; i < 2; i++) {
      var number = this.randomNumber(this.MAX_POKEMON);
      const res = await this.pokedex.getPokemon(number).toPromise();
      const ataques = await this.asignarAtaques(res) as any;
      this.pokemon[i] = {
        name: res.name.toUpperCase(),
        height: res.height,
        weight: res.weight,
        types: res.types.map((type: any) => type.type.name.toUpperCase()),
        image: res.sprites,
        stats: res.stats,
        atack1: ataques[0],
        atack2: ataques[1]
      }
      this.hp[i] = this.pokemon[i].stats[0].base_stat as number;
      this.maxHp[i] = this.hp[i];
      console.log(this.pokemon[i])
    }
    if(this.contadorError >= 10){
      this.contadorError = 0;
      console.log('Se produjo un error al asignar las habilidades de un pokemon, volviendo a buscar pokemon...')
      this.generarPokemon();
    }
  }

  randomNumber(max: number) {
    return Math.floor(Math.random() * (max - 1) + 1);
  }

  async asignarAtaques(res: any) {
    var ataques = [] as any;
    var errorCount = 0;
    for (var i = 0; i < 2; i++) {
      var movimiento = "";
      while (movimiento !== "damage") {
        var number = this.randomNumber(res.moves.length);
  
        try {
          const res2 = await this.pokedex.getMove(res.moves[number].move.url).toPromise();
  
          if (res2.meta.category.name === "damage") {
            if (res2.accuracy != null && res2.pp != null && res2.power != null && res2.type != null && res2.name != null) {
              movimiento = "damage";
              const bgcolor = this.logica.elegirColor(res2.type.name.toUpperCase());
              ataques[i] = {
                name: res2.name,
                accuracy: res2.accuracy,
                maxpp: res2.pp,
                pp: res2.pp,
                power: res2.power,
                type: res2.type.name,
                color: bgcolor
              };
            }
          }
        } catch (error) {
          console.log("Error obteniendo movimiento, probando a coger otro movimiento...");
          errorCount++;
        }
        // Si ha fallado más de 5 veces reseteamos y cambiamos los pokemon
        if(errorCount >= 10){
          movimiento = "damage";
          i = 3;
        }
      }
    }
      return ataques;
  }

  private keydownListener = (event: KeyboardEvent) => {
    this.accionTecla(event.key);
  };

  accionTecla(event: string) {
    if(this.usarCombateCPU){
      setTimeout(async () => {
        if(this.comunication.encendido.value){
            if(event === 'Backspace'){
              if(!this.cargado)
                this.ngOnDestroy();
              else{
                if(this.dentroSeccion){
                  setTimeout(() => {
                    this.dentroSeccion = false;
                    this.seccionBolsa = false;
                    this.seccionLuchar = false;
                    this.seccionPokemon = false;
                  },20)
                  setTimeout(() => {
                    this.cambiarSeleccionado();
                  }, 20);
                }
              }
            } else if(event === 'Enter' && this.cargado){
              if(!this.dentroSeccion){
                this.entrarSeccion();
              }
              else if(this.seccionLuchar){
                var ganador = false;
                for (let i = 0; i < 2; i++) {
                  await this.realizarMovimiento(i);
                  const ganador = this.comprobarGanador();
                  if (await ganador) {
                    i = 3;
                    this.usarCombateCPU = false;
                  }
                  await delay(800);
                }
              }
            } else if(event === 'ArrowRight' && this.cargado){
                this.moverMenu("derecha");
            } else if(event === 'ArrowLeft' && this.cargado){
                this.moverMenu("izquierda");
            } else if(event === 'ArrowUp' && this.cargado){
                this.moverMenu("arriba");
            } else if(event === 'ArrowDown' && this.cargado){
                this.moverMenu("abajo");
            }
        } else{
          this.ngOnDestroy();
        }
      },50)
    }
  }
  moverMenu(lugar: string) {
      if(lugar === "derecha"){
        if(this.arriba){
          if(this.numSeccion == 1){
            this.numSeccion++;
            this.cambiarSeleccionado();
          }
        } else {
          if(this.numSeccion == 3){
            this.numSeccion++
            this.cambiarSeleccionado()
          }
        }
      } else if(lugar === "izquierda"){
        if(this.arriba){
          if(this.numSeccion == 2){
            this.numSeccion--;
            this.cambiarSeleccionado();
          }
        } else {
          if(this.numSeccion == 4){
            this.numSeccion--;
            this.cambiarSeleccionado()
          }
        }
      } else if(lugar === "arriba"){
          if(!this.arriba){
            this.arriba = true;
            this.numSeccion -= 2;
            this.cambiarSeleccionado()
          }
      } else{
        if(this.arriba){
          this.arriba = false;
          this.numSeccion += 2;
          this.cambiarSeleccionado()
        }
      }
  }

  cambiarSeleccionado() {
    // Buscamos y quitamos la antigua opcion seleccionada como seleccionado
    const antiguaOpcion = document.querySelector('.seleccionado-combate') as HTMLElement;
    antiguaOpcion.classList.remove('seleccionado-combate');
    antiguaOpcion.classList.add('no-seleccionado-combate');

    // Buscamos y agregamos como nueva opcion seleccionada a la nueva seleccionada
    const nuevaOpcion = document.querySelector('#seccionCombate' + this.numSeccion) as HTMLElement;
    nuevaOpcion.classList.remove('no-seleccionado-combate');
    nuevaOpcion.classList.add('seleccionado-combate');
  }
  async quitarVida(daño: number, pokemon: number) {
    if(this.hp[pokemon] > 0)
      this.hp[pokemon] -= daño;
    if(this.hp[pokemon] <= 0)
      this.hp[pokemon] = 0;
    const porcentaje = (this.hp[pokemon] * 100) / this.maxHp[pokemon];
    if(pokemon == 0){
      this.barraSaludUser.style.width = porcentaje + "%";
    } else{
      this.barraSaludCPU.style.width = porcentaje + "%";
    }
    await delay(800);
  }

  entrarSeccion(){
    this.dentroSeccion = true;
    if(this.numSeccion == 1){
      this.seccionLuchar = true;
      } else if(this.numSeccion == 2){
        this.seccionPokemon = true;
      } else if(this.numSeccion == 3){
        this.seccionBolsa = true;
      } else if(this.numSeccion == 4){
        this.comunication.volverMenu.next(true);
        this.comunication.accion.next('Backspace');
        this.ngOnDestroy();
      }
    }
    async realizarMovimiento(pokemon: number){
      var movimiento = "" as any;
      var ataque = 0;

      if(pokemon == 0){
        if(this.numSeccion == 1){
          movimiento = this.pokemon[pokemon].atack1;
        }else if(this.numSeccion == 2){
          movimiento = this.pokemon[pokemon].atack2;
        }
      }else{
        const num = Math.round(Math.random());
        if(num == 0){
          movimiento = this.pokemon[pokemon].atack1;
        }else {
          movimiento = this.pokemon[pokemon].atack2;
        }
      }
      // Movimiento del usuario
      this.mensaje = (this.pokemon[pokemon].name + " va a utilizar " + movimiento.name);
      var resultado = "" as any;
      if(pokemon == 0)
        resultado = this.logica.calcularDaño(this.pokemon[0], this.pokemon[1], movimiento);
      else
        resultado = this.logica.calcularDaño(this.pokemon[1], this.pokemon[0], movimiento);
        return new Promise<void>((resolve) => {
            if(resultado.fallo){
              this.mensaje = (this.pokemon[pokemon].name + " ha fallado al realizar el ataque.");
            } else{
              ataque = resultado.daño as number;
              if(pokemon == 0)
                this.quitarVida(ataque,1);
              else
                this.quitarVida(ataque,0);
              if(resultado.critico)
                this.mensaje = (movimiento.name + " con CRÍTICO ha quitado un total de " + ataque + " hp.")
              else
                this.mensaje = (movimiento.name + " ha quitado un total de " + ataque + " hp.")
            }
            resolve();
        });
    }

    async comprobarGanador(){
      var ganador = false;
      var num = -1;
      for(var i = 0; i < 2; i++){
        if(this.pokemon[i].hp == 0)
          num = i;
      }
      if(num != -1){
        ganador = true;
        this.usarCombateCPU = false;
        this.mensaje = (this.pokemon[i].name + " ha sido DERROTADO.")
        setTimeout(() => {
          if(num == 0){
            this.mensaje = ("El pokemon " + this.pokemon[1].name + " ha ganado la pelea.");
          } else{
            this.mensaje = ("El pokemon " + this.pokemon[1].name + " ha ganado la pelea.");
          }
        }, 600);
        setTimeout(() => {
          this.comunication.volverMenu.next(true);
        }, 600);
      }
      return ganador;
    }
  }
  async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }