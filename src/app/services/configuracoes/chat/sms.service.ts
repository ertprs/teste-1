import { Injectable } from '@angular/core';

import { Sms } from 'src/app/interface/configuracoes/chat/sms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from '../../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  private itemsCollection: AngularFirestoreCollection<Sms>;
  private currentUser:any;
  private idCliente:string;
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Sms>(this.idCliente).doc('dados').collection('configuracao')
  }

  add(dadosSms:Sms)
  {
    dadosSms.createAt = new Date().getTime();
    dadosSms.empresaUid = this.idCliente;
    return this.itemsCollection.doc('chat').collection('sms').add(dadosSms);
  }
  update(id:string,dadosSms:Sms) {
    return this.itemsCollection.doc('chat').collection('sms').doc(id).set(dadosSms,{merge:true});
  }
  delete(id: string) {
    return this.itemsCollection.doc('chat').collection('sms').doc(id).delete();
  }
  get()
  {
    //return this.itemsCollection.doc('chat').collection('contatos').doc<sms>(id).valueChanges();

    return this.itemsCollection.doc('chat').collection('sms',ref=>
      ref.where('empresaUid','==',this.idCliente)
    ).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Sms;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
}
