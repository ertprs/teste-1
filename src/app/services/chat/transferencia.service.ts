import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Ittransferencia } from 'src/app/interface/chat/transferencia';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  private itemsCollection: AngularFirestoreCollection<Ittransferencia>;
  private currentUser:any;
  private idCliente:string;

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService

    ) 
  { 
  
    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Ittransferencia>(this.idCliente).doc('chat').collection('transferencia');
  }

  add(dados:Ittransferencia) {
    dados.createAt = new Date().getTime();
    return this.itemsCollection.add(dados);
  }
  update(id: string, dados: any) {
    return this.itemsCollection.doc(id).set(dados,{merge:true});
  }

  get(id: string) {
  
    return this.itemsCollection.doc<Ittransferencia>(id).valueChanges();
  }
}
