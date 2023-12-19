import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  constructor(private http: HttpClient) { }
  // Recibe un pokemon por su número de pokedex
  getPokemon(number: any): Observable<any> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/' + number);
  }
}
