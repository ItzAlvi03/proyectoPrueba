import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class APIServiceService {
  //private URL = 'https://itzalvi03.pythonanywhere.com/'
  private URL = 'http://127.0.0.1:5000/'
  constructor(private http: HttpClient) {}

  predict(img: any): Observable<any>{
    return this.http.post(this.URL + '/predict', img);
  }
  contorno(data: any): Observable<any>{
    return this.http.post(this.URL + '/contorno', data);
  }
}
