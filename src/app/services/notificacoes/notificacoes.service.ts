import { Itusernotificacao } from './../../interface/user/itusernotificacao';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../global/user.service';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Itnotificacoes } from 'src/app/interface/notificacoes/notificacoes';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NotificacoesService {

  private itemsCollection: AngularFirestoreCollection<Itnotificacoes>;
  private currentUser:any;
  private idCliente:string;
  private idUser:string;

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth

  ) { 
    try{

      console.log(this.global.dadosLogado)
      this.idCliente = this.global.dadosLogado.idCliente;
      this.idUser =  this.afa.auth.currentUser.uid;
      this.itemsCollection = DB.collection<Itnotificacoes>(this.idCliente).doc('notificacoes').collection(this.idUser);
    }
    catch(err)
    {

    }
  }

  add(userUidDestino:any,dados:Itnotificacoes)
  {
    dados.createAt = new Date().getTime();
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection<Itnotificacoes>(this.idCliente).doc('notificacoes').collection(userUidDestino).add(dados);
  }
  update(id: string, dados: Itnotificacoes) {
    return this.itemsCollection.doc<Itnotificacoes>(id).update(dados);
  }
  notMarcarComoLido(notificacaoUid:string)
  {
    this.idCliente  = this.global.dadosLogado.idCliente;
    let usuarioUid  = this.afa.auth.currentUser.uid;
    

    return this.DB.collection('users').doc(usuarioUid).collection('notificacoes').doc(notificacaoUid).set({visualizado:true},{merge:true})
  }
  
  notDelete(notificacaoUid:string)
  {
    this.idCliente  = this.global.dadosLogado.idCliente;
    let usuarioUid  = this.afa.auth.currentUser.uid;
    

    return this.DB.collection('users').doc(usuarioUid).collection('notificacoes').doc(notificacaoUid).delete()
  }
  getAll(idCliente:string)
  {
    this.idUser = this.afa.auth.currentUser.uid;
    this.itemsCollection = this.DB.collection<Itnotificacoes>(idCliente).doc('notificacoes').collection(this.idUser);
      return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itnotificacoes;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  getNotificacoes()
  {
    this.idCliente  = this.global.dadosLogado.idCliente;
    let usuarioUid  = this.afa.auth.currentUser.uid;
    

    return this.DB.collection('users').doc(usuarioUid).collection('notificacoes',ref => ref.where('visualizado','==',false) ).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data}
      })))
    
  }
  AddGlobal(dados:Itusernotificacao)
  {
    dados.createAt = new Date().getTime();
    dados.Remusuario_nome = this.afa.auth.currentUser.displayName;
    dados.Remusuario_uid = this.afa.auth.currentUser.uid;

    return this.DB.collection('notificacao').add(dados)
  }
  delete(id: string) {
    return this.itemsCollection.doc(id).delete();
  }
  get(id: string) {
    return this.itemsCollection.doc<Itnotificacoes>(id).valueChanges();
  }
}
