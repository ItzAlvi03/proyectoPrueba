import { Component, OnInit } from '@angular/core';
import { RickMorty } from 'src/app/interfaces/rick-morty';
import { RickMortyServiceService } from 'src/app/Services/rick-morty-service.service';
import { ActivatedRoute, NavigationExtras, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-rick-morty',
  templateUrl: './rick-morty.component.html',
  styleUrls: ['./rick-morty.component.css']
})
export class RickMortyComponent implements OnInit{
  characters: RickMorty[] = [];
  page: number = 1;
  maxPage: number = 40;
  
  constructor(private route: ActivatedRoute, private router: Router ,private service: RickMortyServiceService) {}
  
  ngOnInit(): void {
    this.service.getMaxPage().subscribe((page: number) => {
      this.maxPage = page;
    })
    this.route.params.subscribe(params => {
      const page = params['page'];
      this.page = page as number;
      this.getCharacters();
    });
  }
  
  siguientePagina() {
    this.page++;
    this.router.navigate(['/rickMorty', this.page]);
  }

  anteriorPagina() {
    this.page--;
    this.router.navigate(['/rickMorty', this.page]);
  }

  getCharacters() {
    this.characters = [];
    this.service.getCharacters(this.page).subscribe((res:any) => {
      const mappedCharacters: RickMorty[] = res['results'].map((character: any) => {
        return {
          id: character.id,
          name: character.name,
          image: character.image,
          species: character.species,
          gender: character.gender,
          created: character.created,
          status: character.status,
        };
      });

      this.characters = [...this.characters, ...mappedCharacters];
    })
  }
}
