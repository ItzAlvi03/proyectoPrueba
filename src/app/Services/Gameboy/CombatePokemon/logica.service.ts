import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogicaService {

  constructor() { }
  calcularDaño(nivelAtacante: number, ataqueAtacante: number, defensaDefensor: number, poderAtaque: number): number {
    // Modificadores
    const mod1 = 1;  // 1°Mod.
    const STAB = 1;  // Modificador de tipo
    const efectividad = 1;  // Efectividad (puedes ajustar esto según el tipo del ataque y el Pokémon defensor)

    // Fórmula del daño
    const daño = Math.floor(
      ((2 * nivelAtacante / 5 + 2) * ataqueAtacante * poderAtaque / defensaDefensor) / 50 * mod1 + 2
    ) * STAB * efectividad;

    return daño;
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
}
