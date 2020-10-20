import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/global/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServAtendimentoDepartamentoService {
  private idCliente:string;
  constructor(
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth,
  ) { }

  add(dados:any)
  {

    this.idCliente = this.global.dadosLogado.idCliente;
    dados.createAt = new Date().getTime()
    dados.usuarioUid = this.afa.auth.currentUser.uid
    dados.usuarioNome = this.afa.auth.currentUser.displayName
    return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('atend').collection('departamentos').add(dados)
  }

  getAll()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('atend').collection('departamentos', ref => ref.orderBy('nome','desc')).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() ;
        const id = a.payload.doc.id;
   
        return {id, ... data}
      }))
    )
  }
  delete(id:string)
  {
    return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('atend').collection('departamentos').doc(id).delete()
  }
}
