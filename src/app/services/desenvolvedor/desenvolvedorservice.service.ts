import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class DesenvolvedorserviceService {
  private idCliente:string;
  constructor(
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth,
    
  ) { }

  getAllLog()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('log').doc('log').collection('api',ref => ref.orderBy('createAt','desc').limit(50)).valueChanges()

  }
}
