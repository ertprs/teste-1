import { Itseguserlogado } from './../../interface/seguranca/itseguserlogado';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Conversas } from 'src/app/interface/chat/conversas';







@Injectable({
  providedIn: 'root'
})
export class UserService {
 

  public dadosLogado:Itseguserlogado;
  //public dadosUsuario = new Subject<Itseguserlogado>();


  public conversas = new Array<Conversas>();

  public notificacoes = [];
  public notificacoesQtd:number = 0;

  public conversaUidAtiva:string;
  public urlHistory:string = 'home'


  public msgDigitando = new Array()


  constructor() { 
   
  }
  PrencherInfosUsuario(value: Itseguserlogado) {
    this.dadosLogado = value;
    console.log('Updata data user active '+value)
  
   // this.dadosUsuario.next(value); 
  }




  
}
