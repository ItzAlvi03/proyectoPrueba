import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RickMortyServiceService } from 'src/app/Services/rick-morty-service.service';

@Component({
  selector: 'app-rick-morty-card',
  templateUrl: './rick-morty-card.component.html',
  styleUrls: ['./rick-morty-card.component.css']
})
export class RickMortyCardComponent implements OnInit{
  screenWidth!: number;
  character: any = "";
  page: any;
  btnAgrandar: any;
  img: any;
  agrandado: boolean = false;

  constructor(private route: ActivatedRoute, private service: RickMortyServiceService) {}
   ngOnInit(): void {
    this.getScreenWidth();
    window.addEventListener('resize', () => {
      this.getScreenWidth();
      if(this.agrandado){
        this.agrandar();
      }
    });
     const characterId = this.route.snapshot.paramMap.get('id');
     const page = this.route.snapshot.paramMap.get('page');
     this.page = page;
     this.service.getCharacterInfo(characterId).subscribe((res: any) => {
      this.character = res;
     })
   }
   ngAfterViewInit(){
    this.img = document.getElementById('imagen') as HTMLImageElement;
    this.btnAgrandar = document.getElementById('agrandar');

    if (this.btnAgrandar) {
      this.btnAgrandar.addEventListener('click', () => this.agrandar());
    }
   }
   getScreenWidth() {
    this.screenWidth = window.innerWidth;
  }
   agrandar(): void {
    //Se achica si ya esta agrandado
    if(this.agrandado){
      this.agrandado = false;
      this.img.style.width = "100%";
      //Agragamos la animacion
      this.img.classList.add('imagen');
    }else{
      this.agrandado = true;
      const width = this.screenWidth * 0.9
      this.img.style.width = width.toString() + "px";
      //Quitamos la animacion
      this.img.classList.remove('imagen');
    }
   }
}

