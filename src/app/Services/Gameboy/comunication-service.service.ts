import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicationServiceService {
  public accion = new BehaviorSubject<string>('');
  public encendido = new BehaviorSubject<boolean>(false);
  public pantallaCompleta = new BehaviorSubject<boolean>(false);;

  constructor() {}
}
