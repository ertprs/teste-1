import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Itcondpagamento } from 'src/app/interface/financeiro/configuracoes/itcondpagamento';
import { AuthService } from '../../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from '../../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class CondpagamentoService {
  private itemsCollection: AngularFirestoreCollection<Itcondpagamento>;
  private currentUser:any;
  private idCliente:string;
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Itcondpagamento>(this.idCliente).doc('dados').collection('financeiro').doc('configuracoes').collection('condpagamento')

  }
  add(dados:Itcondpagamento)
  {
    dados.createAt = new Date().getTime();
  

    return this.itemsCollection.add(dados);
  }
  update(id: string, dados: Itcondpagamento) {
    return this.itemsCollection.doc<Itcondpagamento>(id).update(dados);
  }
  getAll()
  {
  
    
    return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itcondpagamento;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  delete(id: string) {
    return this.itemsCollection.doc(id).delete();
  }
  get(id: string) {
    return this.itemsCollection.doc<Itcondpagamento>(id).valueChanges();
  }

}


