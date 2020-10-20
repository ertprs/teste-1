import { Injectable } from '@angular/core';

import { ListaTransmissao } from 'src/app/interface/atendimento/lista-transmissao';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../seguranca/auth.service';
import { UserService } from '../global/user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListaTransmissaoService {

  private transmissoesCollection: AngularFirestoreCollection<ListaTransmissao>;
  private idCliente:string;
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService
  ) { }

  // add(transmissao : Grupos, lista : ListaTransmissao){
  //   dados.createAt = new Date().getTime();
  
  //   return this.itemsCollection.add(dados);
  // }

  update(){

  }

  delete(){

  }

  getAll(){

  }

  relGetDetalhes()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('chat').collection("listatransmissao",ref=> ref.orderBy('createAt','desc')).snapshotChanges().pipe(
      map(action => action.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data}
      }))
    )
  }

  relGetDetalhes2()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('chat').collection("listatransmissao",ref=> ref.orderBy('createAt','desc')).get()
  }
}
