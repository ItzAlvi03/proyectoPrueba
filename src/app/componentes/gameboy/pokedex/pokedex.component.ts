import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComunicationServiceService } from 'src/app/Services/Gameboy/comunication-service.service';
import { PokedexService } from 'src/app/Services/Gameboy/pokedex.service';
import { Pokemon } from 'src/app/interfaces/pokemon';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit{
  pokemon: any;
  numero: number = 1;
  types: any;
  constructor(private service: PokedexService, private comunication: ComunicationServiceService){}
  
  ngOnInit(){
    if(this.comunication.encendido)
      this.getCharacters();
  document.addEventListener('keydown', this.keydownListener);
  this.comunication.accion.subscribe((event: string) => {
    this.accionTeclaClick(event);
  });
}

  private keydownListener = (event: KeyboardEvent) => {
    this.accionTecla(event);
  };
  accionTeclaClick(event: string) {
    setTimeout(() => {
      if(this.comunication.encendido){
          if (event === 'ArrowUp' || event === 'ArrowDown') {
            this.cambiarPokemon(event);
          }else if(event === 'Enter'){
            //Implementar ver pokemon con más detalles
          }
      }
    },100)
  }
  accionTecla(event: KeyboardEvent) {
    setTimeout(() => {
      if(this.comunication.encendido){
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            this.cambiarPokemon(event.key);
          }else if(event.key === 'Enter'){
            //Implementar ver pokemon con más detalles
          }
      }
    },100)
  }
  cambiarPokemon(event: string) {
    if(event === "ArrowUp"){
      this.numero++;
      this.getCharacters();
    }else{
      if(this.numero >= 2){
        this.numero--;
        this.getCharacters();
      }
    }
  }


  onImageLoad() {
    // Este método se ejecutará cuando la imagen se haya cargado completamente
    // Ajustamos un pequeño tiempo para el ngFor haya terminado de cargar los types del pokemon
    if(this.comunication.encendido)
      this.colorType();
  }
  colorType() {
    this.types = document.querySelectorAll('#type')
    for(var i = 0; i < this.types.length; i++){
      const color = this.elegirColor(this.types[i].textContent);
      this.types[i].style.backgroundColor = color;
    }
  }

  elegirColor(type: any) {
    switch(type){
      case 'GRASS':
        return "rgb(61,162,36)";
      case 'POISON':
        return "rgb(146,63,204)";
      default:
        return "rgb(0,0,0)";
    }
  }
  

  getCharacters() {
    this.service.getPokemon(this.numero).subscribe((res: any) => {
      if (res && res.name && res.height && res.weight && res.types && res.sprites && res.sprites.front_default) {
        this.pokemon = {
          name: res.name.toUpperCase(),
          height: res.height,
          weight: res.weight,
          types: res.types.map((type: any) => type.type.name.toUpperCase()),
          image: res.sprites.front_default,
        };
      }
    });
  }
}

