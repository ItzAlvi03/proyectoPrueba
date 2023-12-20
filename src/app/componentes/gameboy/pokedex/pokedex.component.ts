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
  pokemon: any = {};
  numero: number = 1;
  types: any;
  img: any;
  imagen: any;
  frontImage: boolean = false;
  pantalla: any;
  usarPokedex: boolean = false;
  constructor(private service: PokedexService, private comunication: ComunicationServiceService){}
  
  ngOnInit(){
    if(this.comunication.encendido)
      this.getCharacters();
    document.addEventListener('keydown', this.keydownListener);
    this.comunication.accion.subscribe((event: string) => {
      this.accionTecla(event);
    });
    this.comunication.pantallaCompleta.subscribe((event: boolean) => {
      this.reposicionarPantalla(event);
    });
    this.usarPokedex = true;
  }
  reposicionarPantalla(event: boolean) {
    if(this.usarPokedex){
      if(this.pantalla){
        if(event){
          this.pantalla.classList.remove('no-pantalla-completa');
          this.pantalla.classList.add('pantalla-completa');
        } else{
          this.pantalla.classList.remove('pantalla-completa');
          this.pantalla.classList.add('no-pantalla-completa');
        }
  
      }
    }
  }
  ngAfterViewInit(){
    this.img = document.querySelector('img') as HTMLImageElement;
    this.pantalla = document.getElementById('content') as any;
  }

  private keydownListener = (event: KeyboardEvent) => {
    this.accionTecla(event.key);
  };

  accionTecla(event: string) {
    if(this.usarPokedex){
      setTimeout(() => {
        if(this.comunication.encendido.value){
            if (event === 'ArrowUp' || event === 'ArrowDown') {
              this.cambiarPokemon(event);
            }else if(event === 'ArrowRight' || event === 'ArrowLeft'){
              if(this.img && this.pokemon.image)
                this.cambiarImg();
            }else if(event === 'Backspace'){
              this.usarPokedex = false;
            }
        } else{
          this.usarPokedex = false;
        }
      },50)
    }
  }

  cambiarImg() {
    if (this.pokemon && this.pokemon.image) {
      if (this.frontImage) {
        if(this.pokemon.image?.back_default){
          this.imagen = this.pokemon.image?.back_default;
          this.frontImage = false;
        }
      } else {
        this.imagen = this.pokemon.image?.front_default;
        this.frontImage = true;
      }
    }
  }

  cambiarPokemon(event: string) {
    this.frontImage = false;
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
  

  getCharacters() {
    this.service.getPokemon(this.numero).subscribe((res: any) => {
      if (res && res.name && res.height && res.weight && res.types && res.sprites) {
        this.pokemon = {
          id: res.id,
          name: res.name.toUpperCase(),
          height: res.height,
          weight: res.weight,
          types: res.types.map((type: any) => type.type.name.toUpperCase()),
          image: res.sprites,
        };
        this.cambiarImg();
      }
    });
  }
}

