import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ListaTransmissao, ListaTransmissaoDisparos } from 'src/app/interface/chat/lista-transmissao';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { UserService } from '../global/user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListatransmissaoService {

  private itemsCollection: AngularFirestoreCollection<ListaTransmissao>; 
  private whereCollection: AngularFirestoreDocument<ListaTransmissao>; 
  private itemsRelCollection: AngularFirestoreCollection<ListaTransmissaoDisparos>;
  private currentUser:any;
  private idCliente:string;

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth
  ) { 
  
    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<ListaTransmissao>(this.idCliente).doc('chat').collection('listatransmissao');
    this.whereCollection = DB.collection<ListaTransmissao>(this.idCliente).doc('chat');
    this.itemsRelCollection = DB.collection<ListaTransmissaoDisparos>(this.idCliente).doc('chat').collection('listatransmissao');
  }

  add(dados:ListaTransmissao) {
    dados.createAt = new Date().getTime();
    dados.usuarioUid = this.afa.auth.currentUser.uid;
    dados.usuarioNome = this.afa.auth.currentUser.displayName;
    return this.itemsCollection.add(dados);
  }
  update(id: string, dados: ListaTransmissao) {
    return this.itemsCollection.doc(id).set(dados,{merge:true});
  }

  get(id: string) {
  
    return this.itemsCollection.doc<ListaTransmissao>(id).valueChanges();
  }

  getAllListas(contatoListaUid:string) {
    return this.whereCollection.collection('listatransmissao', ref => ref.where('contatoListaUid', '==', contatoListaUid)).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as ListaTransmissao;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  getAllRelatorios(listaUid:string) {
    return this.itemsRelCollection.doc('disparos').collection(listaUid).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as ListaTransmissaoDisparos;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  getTransmissaoDetalheFirst(listaUid:string)
  {
    return this.DB.collection(this.idCliente).doc('chat').collection('listatransmissao').doc('disparos').collection(listaUid,ref=> 
    ref.orderBy('createAt','asc')
    .limit(5000)).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const doc = a.payload.doc;
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data,doc}
      }))
    )
  }
}
