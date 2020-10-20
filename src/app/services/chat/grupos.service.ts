import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AuthService } from '../seguranca/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';
import { UserService } from '../global/user.service';
import { Grupos } from 'src/app/interface/chat/grupos';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  private grupoDb:any;
  private idCliente:string;
  private itemsCollection: AngularFirestoreCollection<Grupos>;

  // empresauid/dados/configuracao/contatos/grupos

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private afa:AngularFireAuth,
    private global:UserService
  ) 
  { 
    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Grupos>(this.idCliente).doc('dados').collection('configuracao');
  }
  checkCadastro(grupo:string):Promise<any>
  {
    
    return new Promise((resolve, reject) => {
      ///xXUUb3L6lrwBc5hfltJP/dados/configuracao/contatos/grupos
      let total = 0;
      this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('contatos').collection('grupos', ref => ref.where('nome', '==', grupo)).valueChanges()
      .forEach(dados=>{
        dados.forEach(elem=>{
          total++;
          
          
         })
       
         resolve(total)
      })
     
    


  
      
    

    })
  }
  add(dados : Grupos) {
    dados.createAt = new Date().getTime();
    console.log(this.idCliente);
    //this.itemsCollection = DB.collection<Grupos>(this.idCliente).doc('dados').collection('configuracao');
    return this.itemsCollection.doc('contatos').collection('grupos').add(dados);
  }

  update(id: string, dados : Grupos) {
    return this.itemsCollection.doc(id).set(dados,{merge:true});
  }

  delete(id: string) {
    return this.itemsCollection.doc('contatos').collection('grupos').doc(id).delete();
  }

  get(id : string) {
    return this.itemsCollection.doc('contatos').collection('grupos').doc<Grupos>(id).valueChanges();
  }

  getAll()
  {
    return this.itemsCollection.doc('contatos').collection('grupos').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Grupos;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    );
  }

  getCidades()
  {
    return this.itemsCollection.doc('contatos').collection('cidades').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Grupos;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    );
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
}

