import { Injectable } from '@angular/core';
import { AuthService } from '../seguranca/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Itempresaconf } from 'src/app/interface/empresa/itempresaconf';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class ConfempresaService {

  private itemsCollection: AngularFirestoreCollection<Itempresaconf>;
  private currentUser:any;
  private idCliente:string;
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
  }


  getCofiguracoes(idCliente?:string) {
    if(idCliente == '')
    {
      this.currentUser = this.auth.getCUrrentUser();
      this.idCliente = this.currentUser['idCliente'];
    }
    else
    {
      this.idCliente = idCliente;
    }
    

    return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc<Itempresaconf>('empresa').valueChanges();
  }


}
