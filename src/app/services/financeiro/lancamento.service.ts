import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Itlancamento } from 'src/app/interface/financeiro/lancamento';
import { AuthService } from '../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  private itemsCollection: AngularFirestoreCollection<Itlancamento>;
  public lancamentoDb: any;
  private currentUser:any;
  private idCliente:string;

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Itlancamento>(this.idCliente).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos');
    this.lancamentoDb = DB.firestore.collection(this.idCliente).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos');
  }

  add(dados:Itlancamento)
  {
    dados.createAt = new Date().getTime();
  
    return this.itemsCollection.add(dados);
  }
  update(id: string, dados: Itlancamento) {
    return this.itemsCollection.doc<Itlancamento>(id).update(dados);
  }
  getAll()
  {
    return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itlancamento;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  delete(id: string) {
    return this.itemsCollection.doc(id).delete();
  }
  get(id: string) {
    return this.itemsCollection.doc<Itlancamento>(id).valueChanges();
  }

}
