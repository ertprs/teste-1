import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private idCliente:string;
  constructor(
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth
  ) { }


  enviarEmail(dados:any)
  {
    dados.createAt = new Date().getTime()
    dados.situacao = 0 //0 = Na caixa de saida
    this.idCliente = this.global.dadosLogado.idCliente;

    return this.DB.collection(this.idCliente).doc('email').collection('caixa_saida').add(dados)
  }
}
