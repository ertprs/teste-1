import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Itdre } from 'src/app/interface/financeiro/dre';
import { AuthService } from '../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class DreService {

  private itemsCollection: AngularFirestoreCollection<Itdre>;

  private currentUser:any;
  private idCliente:string;

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Itdre>(this.idCliente).doc('dados').collection('financeiro').doc('calculos').collection('dre');
  }

  add(dados:Itdre)
  {
    dados.createAt = new Date().getTime();
  
    return this.itemsCollection.add(dados);
  }
  update(id: string, dados: Itdre) {
    return this.itemsCollection.doc<Itdre>(id).update(dados);
  }
  getAll()
  {
    return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itdre;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  delete(id: string) {
    return this.itemsCollection.doc(id).delete();
  }
  get(id: string) {
    return this.itemsCollection.doc<Itdre>(id).valueChanges();
  }
}
