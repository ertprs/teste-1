import { AngularFireAuth } from '@angular/fire/auth';
import { Itproduto } from 'src/app/interface/produtos/itproduto';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private itemsCollection: AngularFirestoreCollection<Itproduto>;
  private currentUser:any;
  private idCliente:string;
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private afa:AngularFireAuth,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Itproduto>(this.idCliente).doc('dados').collection('produtos',ref => ref.orderBy('descricaoCurta',"asc"));
  }

  add(dadosRecebidos:Itproduto)
  {
    dadosRecebidos.createAt = new Date().getTime();
    dadosRecebidos.photo = '../../../../assets/img/noimage.png';
    dadosRecebidos.liberadoUso = true;
    dadosRecebidos.qtdDisponivel = 0;
    dadosRecebidos.usuarioUid = this.afa.auth.currentUser.uid;
    

    return this.itemsCollection.add(dadosRecebidos);
  }
  update(id: string, contato: Itproduto) {
    return this.itemsCollection.doc<Itproduto>(id).update(contato);
  }
  get(id: string) {
    return this.itemsCollection.doc<Itproduto>(id).valueChanges();
  }
  getFirst()
  {
    return this.DB.collection<Itproduto>(this.idCliente).doc('dados').collection('produtos',ref => 
    ref.orderBy('descricaoCurta',"asc")
    .limit(10)).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const doc = a.payload.doc;
        const data = a.payload.doc.data() as Itproduto;
        const id = a.payload.doc.id;
        return {id, ... data,doc}
      }))
    )
  }
  getFilter(valor:string)
  {


  
    return this.DB.collection<Itproduto>(this.idCliente).doc('dados').collection('produtos',ref=> ref.orderBy('descricaoCurta','asc')).snapshotChanges().pipe(
    map(action => action.map(a=>{
      
      const data = a.payload.doc.data() as Itproduto;
      const id = a.payload.doc.id;
      const doc = a.payload.doc;
      let Itproduto = data.descricaoCurta
 
      if (Itproduto.toUpperCase().indexOf(valor.toUpperCase()) > -1  )
      {
        return {id, ... data,doc}
      }



      
    }))
  )
      
       
  
   
  }
  getNext(startAfter:any)
  {

 
   
    return this.DB.collection<Itproduto>(this.idCliente).doc('dados').collection('produtos',ref=> 
    ref.orderBy('nome','asc')
    .startAfter(startAfter)
   
    .limit(50)).snapshotChanges().pipe(
      map(action => action.map(a=>{
       
        const data = a.payload.doc.data() as Itproduto;
        const id = a.payload.doc.id;
        const doc = a.payload.doc;
        return {id, ... data,doc}
      }))
    )
  }
  getAll()
  {

    
    return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itproduto;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  delete(id: string) {
    return this.itemsCollection.doc(id).delete();
  }

  

}
