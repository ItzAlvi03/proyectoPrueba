import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RickMortyServiceService {

  constructor(private http: HttpClient) { }

  getCharacters(page: any): Observable<any> {
    return this.http.get('https://rickandmortyapi.com/api/character/?page=' + page);
  }
  getCharacterInfo(id: any){
    return this.http.get('https://rickandmortyapi.com/api/character/' + id);
  }
  getMaxPage(): Observable<number>{
    return this.http.get('https://rickandmortyapi.com/api/character').pipe(map((res: any) => res.info.pages));
  }
}
