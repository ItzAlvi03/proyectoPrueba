import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
  private MAX_POKEMON = 650 as number;
  pokemon!: any [];
  cargado: boolean = false;
  cargando!: boolean;
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
  mensajeSpinner!: string;
  private fin: boolean = false;
  gifAtaque: any;
  animacionUsuario: boolean = false;
  animacionCPU: boolean = false;
  background: any;
  ataque: boolean = false;
  upgrade: boolean = false;
  low: boolean = false;
  
  constructor(private comunication: ComunicationServiceService, private pokedex: PokedexService, private logica: LogicaService, private render: Renderer2 ){}

  ngOnDestroy(): void {
    this.cargado = false;
    this.fin = true;
    this.usarCombateCPU = false;
    document.removeEventListener('keydown', this.keydownListener);
    this.cargando = false;
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(){
    this.cargando = true;
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
      setTimeout(() => {
        this.mensajeSpinner = "Pokemons Cargados, iniciando el combate..."
      }, 50);
      this.comunication.volverMenu.next(false);
      this.cargando = false;
      this.cargado = true;
      setTimeout(() => {
        this.barraSaludUser = document.querySelector('#salud1') as any;
        this.barraSaludCPU = document.querySelector('#salud2') as any;
      },50);
      this.menu = true;
      this.background = document.getElementById('background') as any;
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
      setTimeout(() => {
        if(i == 0)
          this.mensajeSpinner = "Cargando Pokemon del Usuario...";
        else
          this.mensajeSpinner = "Cargando Pokemon de la CPU...";
      }, 50);

      var number = this.randomNumber(this.MAX_POKEMON);
      const res = await this.pokedex.getPokemon(number).toPromise();

      setTimeout(() => {
        if(i == 0)
          this.mensajeSpinner = "Generando ataques del Pokemon del Usuario...";
        else
          this.mensajeSpinner = "Generando ataques del Pokemon de la CPU...";
      }, 50);

      const ataques = await this.asignarAtaques(res) as any;
      const ailments = await this.asignarAilments() as any;
      this.pokemon[i] = {
        name: res.name.toUpperCase(),
        height: res.height,
        weight: res.weight,
        types: res.types.map((type: any) => type.type.name.toUpperCase()),
        image: res.sprites,
        stats: res.stats,
        mod1: 1,
        mod2: 1,
        atack1: ataques[0],
        atack2: ataques[1],
        ailments: ailments
      }
      this.hp[i] = this.pokemon[i].stats[0].base_stat as number;
      this.maxHp[i] = this.hp[i];
    }
    if(this.contadorError >= 10){
      this.contadorError = 0;
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
              const movimientoCopiaProfunda = JSON.parse(JSON.stringify(res2));
              const bgcolor = this.logica.elegirColor(movimientoCopiaProfunda.type.name.toUpperCase());
              ataques[i] = {
                name: movimientoCopiaProfunda.name,
                accuracy: movimientoCopiaProfunda.accuracy,
                maxpp: movimientoCopiaProfunda.pp,
                pp: movimientoCopiaProfunda.pp,
                power: movimientoCopiaProfunda.power,
                type: movimientoCopiaProfunda.type.name,
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

  async asignarAilments() {
    var anterior = 0 as number;
    var ailments = [] as any;
    var numAilments = 0 as number;
  
    while (numAilments < 2) {
      const num = this.randomNumber(4);
  
      if (num != anterior) {
        const newAilment = { ...this.logica.elegirAilment(num) };
        ailments[numAilments] = newAilment;
        anterior = num;
        numAilments++;
      }
    }
  
    return ailments;
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
                var turno = false;
                // Compruebo si son las dos únicas opciones disponibles a usar
                if(this.numSeccion == 1 || this.numSeccion == 2){
                  // Aquí basicamente compruebo que si el movimiento seleccionado tenga PP para poder usarse, en caso de que
                  // ninguno de los 2 únicos movimientos tengan PP se realizará igualmente pero ya está controlado dentro de la función
                  if(this.numSeccion == 1 && this.pokemon[0].atack1.pp > 0 || this.numSeccion == 2 && this.pokemon[0].atack2.pp > 0){
                    turno = true;
                    this.realizarTurnos();
                  }
                } else{
                  if(this.numSeccion == 3 && this.pokemon[0].ailments[0].pp > 0 || this.numSeccion == 4 && this.pokemon[0].ailments[1].pp > 0){
                    turno = true;
                    this.realizarTurnos();
                  }
                }
                if(!turno && (this.pokemon[0].atack1.pp == 0 && this.pokemon[0].atack2.pp == 0 && this.pokemon[0].ailments[0].pp == 0 && this.pokemon[0].ailments[1].pp == 0)){
                  this.realizarTurnos();
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
    if(!this.fin){
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
      var pokemonDañado;
      if(pokemon == 0){
        pokemonDañado = document.getElementById('pokemonUsuario') as any;
      } else{
        pokemonDañado = document.getElementById('pokemonCPU') as any;
      }
      this.animacionDaño(pokemonDañado);
    }
  }

  async animacionDaño(pokemonDañado: any) {
    if(!this.fin)
    for(var i = 0; i < 3; i++){
      if(!this.fin){
        pokemonDañado.classList.remove('no-atacado');
        pokemonDañado.classList.add('atacado');
        await delay(120);
        pokemonDañado.classList.remove('atacado');
        pokemonDañado.classList.add('no-atacado');
        await delay(120);
      }
    }
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
    async realizarTurnos(){
      this.menu = false;
      this.usarCombateCPU = false;
      for (let i = 0; i < 2; i++) {
        await this.realizarMovimiento(i);
        await(1500);
        await this.comprobarGanador(i);
      }
      this.numSeccion = 1;
      this.arriba = true;
    }

    async realizarMovimiento(pokemon: number){
      var movimiento = "" as any;
      var ataque = 0;
      // Si es un movimiento que no es de ataque
      if(pokemon == 0 && (this.numSeccion == 3 || this.numSeccion == 4)){
        var usar = false;
        if(this.numSeccion == 3 && this.pokemon[0].ailments[0].pp > 0){
          usar = true;
          this.pokemon[0].ailments[0].pp--;
          this.pokemon[0].ailments[0].usado++;
        } else if(this.numSeccion == 4 && this.pokemon[0].ailments[1].pp > 0){
          usar = true;
          this.pokemon[0].ailments[1].pp--;
          this.pokemon[0].ailments[1].usado++;
        }
        if(usar){
          const num = this.numSeccion - 3 as number;
          await this.realizarAilment(this.pokemon[pokemon].ailments[num], pokemon);
        }
      } else {
        var ailment = false;
        // Se comprueba que alguna tecnica tenga al menos pp
        if(this.pokemon[pokemon].atack1.pp == 0 && this.pokemon[pokemon].atack2.pp == 0 && this.pokemon[pokemon].ailments[0].pp == 0 && this.pokemon[pokemon].ailments[1].pp == 0){
          movimiento = null;
        } else {
          // Si es el pokemon 0 siginifica que es el del usuario, sino será la CPU
          if(pokemon == 0){
            if(this.numSeccion == 1){
              movimiento = this.pokemon[pokemon].atack1;
              this.pokemon[pokemon].atack1.pp--;
            }else {
              movimiento = this.pokemon[pokemon].atack2;
              this.pokemon[pokemon].atack2.pp--;
            }
          } else{
            // Si el movimiento no tiene pp para utilizarse se volverá a intentar
            movimiento = {
              pp: 0 as number
            }
            while(movimiento.pp == 0){
              const num = Math.floor(Math.random() * (4 - 0) + 0);
              if(num == 0){
                movimiento = this.pokemon[1].atack1;
                this.pokemon[1].atack1.pp--;
              }else if(num == 1) {
                movimiento = this.pokemon[1].atack2;
                this.pokemon[1].atack2.pp--;
              } else if(num == 2){
                if(this.pokemon[1].ailments[0].pp > 0){
                  ailment = true;
                  this.pokemon[1].ailments[0].pp--;
                  this.pokemon[1].ailments[0].usado++;
                  await this.realizarAilment(this.pokemon[1].ailments[0], 1);
                  movimiento.pp = 1;
                }
              } else if(num == 3){
                if(this.pokemon[pokemon].ailments[1].pp > 0){
                  ailment = true;
                  this.pokemon[1].ailments[1].pp--;
                  this.pokemon[1].ailments[1].usado++;
                  await this.realizarAilment(this.pokemon[1].ailments[1], 1);
                  movimiento.pp = 1;
                }
              }
            }
            if(ailment){
              movimiento = null;
            }
          }
          if(movimiento != null){
            // Movimiento del usuario
            this.mensaje = (this.pokemon[pokemon].name + " ha usado " + movimiento.name);
            var resultado = "" as any;
            if(pokemon == 0)
              resultado = this.logica.calcularDaño(this.pokemon[0], this.pokemon[1], movimiento);
            else
              resultado = this.logica.calcularDaño(this.pokemon[1], this.pokemon[0], movimiento);
            if(resultado.fallo){
              await delay(1500);
              if(!resultado.efecto){
                var enemigo = 0;
                if(pokemon == 0)
                  enemigo = 1;
                this.mensaje = (movimiento.name + " no ha surgido efecto...");
              } else
                this.mensaje = (this.pokemon[pokemon].name + " ha fallado al realizar el ataque...");
            } else{
              await this.animacionMovimiento(pokemon,movimiento.type);
              ataque = resultado.daño as number;
              if(pokemon == 0)
                this.quitarVida(ataque,1);
              else
                this.quitarVida(ataque,0);
            }
            if(resultado.critico && ataque > 0){
              await delay(1200);
              this.mensaje = (movimiento.name + " es súper efectivo.");
            }
            await delay(1500);
    
          } else{
            if(!ailment){
              this.mensaje = (this.pokemon[pokemon].name + " no tiene ninguna habilidad para usar.");
              await delay(1500);
            }
          }
        }
      }
    }

    async realizarAilment(movimiento: any, pokemon: number){
      this.mensaje = (this.pokemon[pokemon].name + " ha usado " + movimiento.name);
      var resultado = false;
      var num = 0;
      if(movimiento.usado <= 6){
        if(movimiento.target === 'user')
          resultado = await this.modificarStats(pokemon, movimiento, "subir");
        else{
          if(pokemon == 0)
            num = 1;
  
          resultado = await this.modificarStats(num,movimiento, "bajar");
        }
      }
      await delay(350);
      if(resultado){
        this.ataque = false;
        if(movimiento.target === 'user'){
          this.upgrade = true;
          setTimeout(async () => {
            if(pokemon == 0)
              this.animacionUsuario = true;
            else
              this.animacionCPU = true;
  
            await delay(1100);
            this.animacionCPU = false;
            this.animacionUsuario = false;
            this.mensaje = (this.pokemon[pokemon].name + " ha subido su " + movimiento.mod_stat)
            this.upgrade = false;
          },30);
        }
        else{
          this.low = true;
          setTimeout(async () => {
            if(num == 0)
              this.animacionUsuario = true;
            else
              this.animacionCPU = true;
  
            await delay(1100);
            this.animacionCPU = false;
            this.animacionUsuario = false;
            this.mensaje = (this.pokemon[num].name + " ha bajado su " + movimiento.mod_stat);
            this.low = false;
          },30);
        }
      } else{
        if(movimiento.target === 'user')
          this.mensaje = (this.pokemon[pokemon].name + "no puede subir más su " + movimiento.mod_stat)
        else
          this.mensaje = (this.pokemon[num].name + " no puede bajar más su " + movimiento.mod_stat)
      }
      await delay(1500);
    }
  
  async modificarStats(num: number, movimiento: any, modificador: string): Promise<boolean> {
    var resultado = false;
    if(movimiento.mod_stat === 'attack'){
      if(modificador === 'subir'){
        resultado = true;
        this.pokemon[num].mod1 *= 1.5;
      } else if(modificador === 'bajar'){
        resultado = true;
        this.pokemon[num].mod1 *= 0.5;
      }
    } else if(movimiento.mod_stat === 'defense'){
      if(modificador === 'subir'){
        resultado = true;
        this.pokemon[num].mod2 *= 1.5;
      } else if(modificador === 'bajar'){
        resultado = true;
        this.pokemon[num].mod2 *= 0.5;
      }
    }
    return resultado;
  }

  async animacionMovimiento(pokemon: number, type: string) {
    // Esperamos un poco desde que se muestra el mensaje del ataque a realizar,
    // luego ponemos el fondo oscuro y la animación en cuestión
    await delay(350);
    var movimiento = this.logica.elegirAnimacion(type.toUpperCase());

    if(movimiento) {
      this.background.classList.remove('no-oscuro');
      this.background.classList.add('oscuro');
      this.gifAtaque = movimiento;
      this.ataque = true;
      var img: any;
      
      // Si es 0 significa que el ataque va desde el pokemon usuario hasta el CPU
      if (pokemon == 0) {
        this.animacionUsuario = true;
        await delay(950);
        img = document.getElementById('ataqueAnimacion');
        img.classList.add('lanzar-derecha');
      } else {
        this.animacionCPU = true;
        await delay(950);
        img = document.getElementById('ataqueAnimacion');
        img.classList.add('lanzar-izquierda');
      }
      // Esperamos hasta que la animación se complete y luego volvemos a resetear todo
      await delay(500);
      this.background.classList.remove('oscuro');
      this.background.classList.add('no-oscuro');
      
      if (img) {
        if (pokemon == 0) {
          img.classList.remove('lanzar-derecha');
          this.animacionUsuario = false;
        } else {
          img.classList.remove('lanzar-izquierda');
          this.animacionCPU = false;
        }
      }
      this.gifAtaque = "";
    }
  }

    async comprobarGanador(pokemon: number){
      var num = -1;
      for(var i = 0; i < 2; i++){
        if((this.hp[i] as number) == 0){
          num = i;
        }
      }
      if(num != -1){
        if(!this.fin){
          var img: any;
          if(num == 0)
            img = this.render.selectRootElement('#pokemonUsuario');
          else
            img = this.render.selectRootElement('#pokemonCPU');
          
          this.render.addClass(img, 'achicar');

          this.usarCombateCPU = false;
          this.mensaje = (this.pokemon[num].name + " ha sido DERROTADO.")
          this.usarCombateCPU = false;
          await delay(1500);
          if(num == 0){
            this.mensaje = ("El pokemon " + this.pokemon[1].name + " ha ganado la pelea.");
          } else{
            this.mensaje = ("El pokemon " + this.pokemon[0].name + " ha ganado la pelea.");
          }
          await delay(1500);
          for(var seg = 5; seg >= 0; seg--){
            this.mensaje = "Volviendo al menú de la Gameboy en " + seg + " segundos...";
            await delay(1000);
          }
          this.comunication.volverMenu.next(true);
          this.comunication.accion.next('Backspace');
          this.ngOnDestroy();
        }
      } else if(num == -1 && pokemon == 1){
        this.usarCombateCPU = true;
        this.menu = true;
      }
    }
  }
  async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }