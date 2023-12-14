import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicationServiceService {
  public accion = new BehaviorSubject<string>('');
  public encendido: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}
}
