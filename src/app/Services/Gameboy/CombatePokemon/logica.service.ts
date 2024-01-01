import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogicaService {
  private relacionesDeTipo = {
    NORMAL: { ROCK: 0.5, GHOST: 0, STEEL: 0.5 },
    FIGHTING: { NORMAL: 2, FLYING: 0.5, POISON: 0.5, ROCK: 2, BUG: 0.5, GHOST: 0, STEEL: 2, PSYCHIC:0.5, ICE: 2, DARK: 2, FAIRY: 0.5 },
    FLYING: { FIGHTING: 2, ROCK: 0.5, BUG: 2, STEEL: 0.5, GRASS: 2, ELECTRIC: 0.5 },
    POISON: { POISON: 0.5, GROUND: 0.5, ROCK: 0.5, GHOST: 0.5, STEEL: 0, GRASS: 2, FAIRY: 2 },
    GROUND: { FLYING: 0, POISON: 2, ROCK: 2, BUG: 0.5, STEEL: 2, FIRE: 2, GRASS: 0.5, ELECTRIC: 2 },
    ROCK: { FIGHTING: 0.5, FLYING: 2, GROUND: 0.5, BUG: 2, STEEL: 0.5, FIRE: 2, ICE: 2 },
    BUG: { FIGHTING: 0.5, FLYING: 0.5, POISON: 0.5, GHOST: 0.5, STEEL: 0.5, FIRE: 0.5, GRASS: 2, PSYCHIC: 2, DARK: 2, FAIRY: 0.5 },
    GHOST: { NORMAL: 0, GHOST: 2, PSYCHIC: 2, DARK: 0.5 },
    STEEL: { ROCK: 2, STEEL: 0.5, FIRE: 0.5, WATER: 0.5, ELECTRIC: 0.5, ICE: 2, FAIRY: 2 },
    FIRE: { ROCK: 0.5, BUG: 2, STEEL: 2, FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 2, DRAGON: 0.5 },
    WATER: { GROUND: 2, ROCK: 2, FIRE: 2, GRASS: 0.5, WATER: 0.5, DRAGON: 0.5 },
    GRASS: { FLYING: 0.5, POISON: 0.5, GROUND: 2, ROCK: 2, BUG: 0.5, STEEL: 0.5, FIRE: 0.5, WATER: 2, GRASS: 0.5, DRAGON: 0.5 },
    ELECTRIC: { FLYING: 2, GROUND: 0, WATER: 2, GRASS: 0.5, ELECTRIC: 0.5, DRAGON: 0.5 },
    PSYCHIC: { FIGHTING: 2, POISON: 2, STEEL: 0.5, PSYCHIC: 0.5, DARK: 0 },
    ICE: { FLYING: 2, GROUND: 2, STEEL: 0.5, FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 0.5, DRAGON: 2 },
    DRAGON: { STEEL: 0.5, DRAGON: 2, FAIRY: 0 },
    DARK: { FIGHTING: 0.5, GHOST: 2, PSYCHIC: 2, DARK: 0.5, FAIRY: 0.5 },
    FAIRY: { FIGHTING: 2, POISON: 0.5, STEEL: 0.5, FIRE: 0.5, DRAGON: 2, DARK: 2 },
  } as any;
  private ailments: { [key: number]: { name: string, type: string, mod_stat: string, target: string, color: string } } = {
    1: { name: 'Sword-Dance', type: 'normal', mod_stat: 'attack', target: 'user', color: "#A0A2A0" },
    2: { name: 'Block', type: 'normal', mod_stat: 'defense', target: 'user', color: "#A0A2A0"  },
    3: { name: 'Growl ', type: 'normal', mod_stat: 'attack', target: 'enemy', color: "#A0A2A0"  },
  };

  constructor() { }
  calcularDaño(pokemonAtacante: any, pokemonDefensor: any, atack: any): any {
    const mod1 = pokemonAtacante.mod1 as number;  // Si el atacante tiene el ataque con alguna habilidad subido o bajada
    const mod2 = pokemonDefensor.mod2 as number; // Este modificador es la defensa extra si está subida o bajada en el defensor
    var STAB = 1;  // Modificador de tipo si el ataque es el mismo tipo que el pokemon
    var efectividad = 1;  // Efectividad del ataque contra el tipo del oponente
    const ataqueBase = pokemonAtacante.stats[1]?.base_stat as number || 0;
    const defensaBase = pokemonDefensor.stats[2]?.base_stat as number || 0;
    var random = this.generarRandom();
    if(random <= (atack.accuracy as number)){
      // Calculamos el crítico
      random = this.generarRandom();
      var critico = 1;
      if(random <= 10)
          critico = 1.5;

      // Calculamos si el STAB será de 1 o 1.5
      pokemonAtacante.types.forEach((tipo: any) => {
        if(tipo.toUpperCase() === atack.type.toUpperCase())
        STAB = 1.5;
      });

      // Calculamos la efectividad final del ataque contra el defensor
      efectividad = this.calcularEfectividad(atack, pokemonDefensor.types);
      var resultado;
      if(efectividad == 0){
        // El tipo del ataque no tiene efecto contra el tipo del pokemon
        resultado = {
          fallo: true as boolean,
          daño: 0 as number,
          critico: false as boolean,
          efecto: false as boolean
        }

      } else {
        // Fórmula del daño
        const daño = Math.floor(
          (((2 * 1 / 5 + 2) * ataqueBase * atack.power / (defensaBase * mod2)) / 50 * mod1 + 2)
          * STAB * critico * efectividad
      );
  
        var ch = false as boolean;
         if(critico != 1)
          ch = true;
          resultado = {
            fallo: false as boolean,
            daño: daño as number,
            critico: ch as boolean,
            efecto: true as boolean
          }

      }
      return resultado;

    } else{
      // Falla el ataque porque el accuracy no fue el suficiente para realizarlo
      resultado = {
        fallo: true as boolean,
        daño: 0 as number,
        critico: false as boolean,
        efecto: true as boolean
      }
      return resultado;
    }
  }
  
  private generarRandom(): number {
    return Math.floor(Math.random() * 101);
  }

  private calcularEfectividad(ataque:any, tiposPokemonDefensor:any) {
    const tipoAtaque = ataque.type.toUpperCase() as string;
    let efectividadTotal = 1;
    tiposPokemonDefensor.forEach((tipoDefensor: any) => {
        if (this.relacionesDeTipo[tipoAtaque] && this.relacionesDeTipo[tipoAtaque][tipoDefensor] !== undefined) {
            efectividadTotal *= this.relacionesDeTipo[tipoAtaque][tipoDefensor];
        }
    });

    return efectividadTotal;
}


  elegirColor(type: any) {
    switch(type){
      case 'GRASS':
        return "rgb(61,162,36)";
      case 'POISON':
        return "rgb(146,63,204)";
      case 'FIRE':
        return "#E62425";
      case 'FLYING':
        return "#81B9EF";
      case 'WATER':
        return "#2980EF";
      case 'BUG':
        return "#91A119";
      case 'NORMAL':
        return "#A0A2A0";
      case 'ELECTRIC':
        return "#FAC000";
      case 'GROUND':
        return "#915121";
      case 'FIGHTING':
        return "#FF8000";
      case 'PSYCHIC':
        return "#EF4179";
      case 'ROCK':
        return "#AFA981";
      case 'STEEL':
        return "#61A1B8";
      case 'ICE':
        return "#3FD8FF";
      case 'FAIRY':
        return "#D38BB1";
      case 'GHOST':
        return "#642265";
      case 'DRAGON':
        return "#5061E1";
      case 'DARK':
        return "#50413F";
      default:
        return "rgb(0,0,0)";
    }
  }

  elegirAnimacion(type: any):any {
    switch(type){
      case 'GRASS':
        return null;
      case 'POISON':
        return null;
      case 'FIRE':
        return "../../../../assets/gifs/fireball.gif";
      case 'FLYING':
        return null;
      case 'WATER':
        return "../../../../assets/gifs/waterball.gif";
      case 'BUG':
        return null;
      case 'NORMAL':
        return null;
      case 'ELECTRIC':
        return null;
      case 'GROUND':
        return null;
      case 'FIGHTING':
        return null;
      case 'PSYCHIC':
        return null;
      case 'ROCK':
        return null;
      case 'STEEL':
        return null;
      case 'ICE':
        return null;
      case 'FAIRY':
        return null;
      case 'GHOST':
        return null;
      case 'DRAGON':
        return null;
      case 'DARK':
        return null;
    }
  }

  elegirAilment(num: number): any{
    return this.ailments[num];
  }
}
