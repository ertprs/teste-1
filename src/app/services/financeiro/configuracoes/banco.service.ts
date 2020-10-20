import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Itbanco } from 'src/app/interface/financeiro/configuracoes/itbanco';
import { AuthService } from '../../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from '../../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  private itemsCollection: AngularFirestoreCollection<Itbanco>;
  private currentUser:any;
  private idCliente:string;

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Itbanco>(this.idCliente).doc('dados').collection('financeiro').doc('configuracoes').collection('bancos');
  }

  add(dados:Itbanco) {
    dados.createAt = new Date().getTime();
  
    return this.itemsCollection.add(dados);
  }
  update(id: string, dados: Itbanco) {
    return this.itemsCollection.doc<Itbanco>(id).update(dados);
  }
  getAll() {
    return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itbanco;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  delete(id: string) {
    return this.itemsCollection.doc(id).delete();
  }
  get(id: string) {
    return this.itemsCollection.doc<Itbanco>(id).valueChanges();
  }

  getBancos() {
    return this.DB.collection('baseapoio').doc('gerais').collection('bancos').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
}
