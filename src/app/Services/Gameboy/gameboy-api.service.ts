import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameboyAPIService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Inserta un usuario a la BD
  insertarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl + '/insertarUsuario', usuario);
  }
  comprobarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl + '/comprobarUsuario', usuario);
  }
}
