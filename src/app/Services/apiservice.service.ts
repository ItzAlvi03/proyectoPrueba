import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class APIServiceService {
  constructor(private http: HttpClient) {}

  getVersion(): Observable<any>{
    return this.http.get('http://127.0.0.1:5555/apiVersion');
  }
  getAPILocalTime(): Observable<any>{
    return this.http.get('http://127.0.0.1:5555/localTime');
  }
  getArea(tamanio: any): Observable<any>{
    return this.http.post('http://127.0.0.1:5555/calcularArea', tamanio);
  }
}
