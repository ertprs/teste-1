import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class ConsumopainelService {

  private idCliente:string;
  constructor(
    private DB:AngularFirestore,
    private global:UserService
  ) { }


  getPainel()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('consumo_painel').valueChanges()
  }
}
