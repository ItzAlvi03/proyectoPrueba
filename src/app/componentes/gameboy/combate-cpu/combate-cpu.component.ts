import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LogicaService } from 'src/app/Services/Gameboy/CombatePokemon/logica.service';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';
import { PokedexService } from 'src/app/Services/Gameboy/pokedex.service';

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
  private barraSalud!: any[];
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
      this.barraSalud = [];
      setTimeout(() => {
        this.barraSalud = document.querySelectorAll('#salud') as any;
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
    //console.log('Pokemons listos! Empieza la prueba:')
    //var hp1 = this.pokemon[0].stats[0].base_stat as number;
    //var hp2 = this.pokemon[1].stats[0].base_stat as number;
    //var resultado = "" as any;
    //var ataque = 0 as number;
    //var continuar = true as boolean;
    //while(continuar){
    //  console.log(this.pokemon[0].name + " va a utilizar " + this.pokemon[0].atack1.name);
    //  resultado = this.logica.calcularDaño(this.pokemon[0], this.pokemon[1], this.pokemon[0].atack1);
    //  if(resultado.fallo){
    //    console.log(this.pokemon[0].name + " ha fallado al realizar el ataque.");
    //  } else{
    //    ataque = resultado.daño as number;
    //    if(resultado.critico)
    //      console.log(this.pokemon[0].atack1.name + " con CRÍTICO ha quitado un total de " + ataque + " hp.")
    //    else
    //      console.log(this.pokemon[0].atack1.name + " ha quitado un total de " + ataque + " hp.")
//
    //    if(ataque >= hp2){
    //      continuar = false;
    //      console.log(this.pokemon[1].name + " ha sido derrotado.");
    //    }else{
    //      hp2 -= ataque;
    //      console.log(this.pokemon[1].name + " se ha quedado a " + hp2 + " de vida.");
    //    }
    //  }
    //  if(continuar){
    //    console.log(this.pokemon[1].name + " va a utilizar " + this.pokemon[1].atack1.name);
    //    resultado = this.logica.calcularDaño(this.pokemon[1], this.pokemon[0], this.pokemon[1].atack1);
    //    if(resultado.fallo){
    //      console.log(this.pokemon[1].name + " ha fallado al realizar el ataque.");
    //    } else{
    //      ataque = resultado.daño as number;
    //      if(resultado.critico)
    //        console.log(this.pokemon[1].atack1.name + " con CRÍTICO ha quitado un total de " + ataque + " hp.")
    //      else
    //        console.log(this.pokemon[1].atack1.name + " ha quitado un total de " + ataque + " hp.")
    //        if(ataque >= hp1){
    //          continuar = false;
    //          console.log(this.pokemon[0].name + " ha sido derrotado.");
    //        }else{
    //          hp1 -= ataque;
    //          console.log(this.pokemon[0].name + " se ha quedado a " + hp1 + " de vida.");
    //        }
    //    }
    //  }
    //}
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
      setTimeout(() => {
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
            } else if(event === 'ArrowRight' && this.cargado){
              if(!this.dentroSeccion){
                this.moverMenu("derecha");
              }
            } else if(event === 'ArrowLeft' && this.cargado){
              if(!this.dentroSeccion){
                this.moverMenu("izquierda");
              }
            } else if(event === 'ArrowUp' && this.cargado){
              if(!this.dentroSeccion){
                this.moverMenu("arriba");
              }
            } else if(event === 'ArrowDown' && this.cargado){
              if(!this.dentroSeccion){
                this.moverMenu("abajo");
              }
            }
        } else{
          this.usarCombateCPU = false;
        }
      },50)
    }
  }
  moverMenu(lugar: string) {
    if(!this.dentroSeccion){

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
  //quitarVida() {
  //  if(this.hp[0] > 0)
  //    this.hp[0] -= 10;
  //  if(this.hp[0] <= 0)
  //    this.hp[0] = 0;
  //  const porcentaje = (this.hp[0] * 100) / this.maxHp[0];
  //  this.barraSalud[0].style.width = porcentaje + "%"
  //}

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
}

