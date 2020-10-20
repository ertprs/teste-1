import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Ittipoimpostos } from 'src/app/interface/financeiro/configuracoes/ittipoimpostos';
import { AuthService } from '../../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from '../../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class TipoimpostosService {

  private itemsCollection: AngularFirestoreCollection<Ittipoimpostos>;
  private currentUser:any;
  private idCliente:string;

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Ittipoimpostos>(this.idCliente).doc('dados').collection('financeiro').doc('configuracoes').collection('tipoimpostos');
  }

  add(dados:Ittipoimpostos)
  {
    dados.createAt = new Date().getTime();
    dados.dreFiltro = 2;
  
    return this.itemsCollection.add(dados);
  }
  update(id: string, dados: Ittipoimpostos) {
    return this.itemsCollection.doc<Ittipoimpostos>(id).update(dados);
  }
  getAll()
  {
    return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Ittipoimpostos;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  delete(id: string) {
    return this.itemsCollection.doc(id).delete();
  }
  get(id: string) {
    return this.itemsCollection.doc<Ittipoimpostos>(id).valueChanges();
  }

}
