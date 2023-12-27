import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LogicaService } from 'src/app/Services/Gameboy/CombatePokemon/logica.service';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';
import { PokedexService } from 'src/app/Services/Gameboy/pokedex.service';

@Component({
  selector: 'app-combate-cpu',
  templateUrl: './combate-cpu.component.html',
  styleUrls: ['./combate-cpu.component.css']
})
export class CombateCPUComponent implements OnInit{
  private destroyed$ = new Subject<void>();
  usarCombateCPU: boolean = false;
  private MAX_POKEMON = 9 as number;
  pokemon!: any [];

  constructor(private comunication: ComunicationServiceService, private pokedex: PokedexService, private logica: LogicaService){}

  ngOnInit(){
    this.usarCombateCPU = true;
    document.addEventListener('keydown', this.keydownListener);
    this.comunication.accion.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((event: string) => {
      this.accionTecla(event);
    });
    this.generarPokemon();
  }
  async generarPokemon() {
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
      console.log(this.pokemon[i])
    }
    console.log('Pokemons listos! Empieza la prueba:')
    var hp1 = this.pokemon[0].stats[0].base_stat as number;
    var hp2 = this.pokemon[1].stats[0].base_stat as number;
    var resultado = "" as any;
    var ataque = 0 as number;
    var continuar = true as boolean;
    while(continuar){
      console.log(this.pokemon[0].name + " va a utilizar " + this.pokemon[0].atack1.name);
      resultado = this.logica.calcularDaño(this.pokemon[0], this.pokemon[1], this.pokemon[0].atack1);
      if(resultado.fallo){
        console.log(this.pokemon[0].name + " ha fallado al realizar el ataque.");
      } else{
        ataque = resultado.daño as number;
        if(resultado.critico)
          console.log(this.pokemon[0].atack1.name + " con CRÍTICO ha quitado un total de " + ataque + " hp.")
        else
          console.log(this.pokemon[0].atack1.name + " ha quitado un total de " + ataque + " hp.")

        if(ataque >= hp2){
          continuar = false;
          console.log(this.pokemon[1].name + " ha sido derrotado.");
        }else{
          hp2 -= ataque;
          console.log(this.pokemon[1].name + " se ha quedado a " + hp2 + " de vida.");
        }
      }
      if(continuar){
        console.log(this.pokemon[1].name + " va a utilizar " + this.pokemon[1].atack1.name);
        resultado = this.logica.calcularDaño(this.pokemon[1], this.pokemon[0], this.pokemon[1].atack1);
        if(resultado.fallo){
          console.log(this.pokemon[1].name + " ha fallado al realizar el ataque.");
        } else{
          ataque = resultado.daño as number;
          if(resultado.critico)
            console.log(this.pokemon[1].atack1.name + " con CRÍTICO ha quitado un total de " + ataque + " hp.")
          else
            console.log(this.pokemon[1].atack1.name + " ha quitado un total de " + ataque + " hp.")
            if(ataque >= hp1){
              continuar = false;
              console.log(this.pokemon[0].name + " ha sido derrotado.");
            }else{
              hp1 -= ataque;
              console.log(this.pokemon[0].name + " se ha quedado a " + hp1 + " de vida.");
            }
        }
      }
    }
  }

  randomNumber(max: number) {
    return Math.floor(Math.random() * (max - 1) + 1);
  }

  async asignarAtaques(res: any) {
    var ataques = [] as any;
  
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
              this.usarCombateCPU = false;
            }
        } else{
          this.usarCombateCPU = false;
        }
      },50)
    }
  }
}
