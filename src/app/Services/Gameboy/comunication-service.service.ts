import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicationServiceService {
  // Sirve para recivir acciones al pulsar un boton
  public accion = new BehaviorSubject<string>('');

  // Para el estado de la GameBoy si está apagada o no
  public encendido = new BehaviorSubject<boolean>(false);

  // Para que todos los componentes puedan saber si está o no
  // en el modo de pantalla completa y adaptarse
  public pantallaCompleta = new BehaviorSubject<boolean>(false);
  
  // Para que el menu principal pueda volver para atras o no dependiendo
  // del componente donde esté el usuario
  public volverMenu = new BehaviorSubject<boolean>(false);

  constructor() {}
}
