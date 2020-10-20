import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class SrvconfemailService {

  constructor(
    private DB:AngularFirestore,
    private global:UserService
  ) { }

  SetConfiguracao(dados:any)
  {

    dados.createAt    = new Date().getTime(),
    dados.empresaUid  = this.global.dadosLogado.idCliente;
    if(dados.smtpUsuario != '')
    {
      dados.smtpTest    = true
    }

    if(dados.imapUsuario != '')
    {
      dados.imapTest    = true
    }
    
    
    return this.DB.collection('contasEmail').doc(this.global.dadosLogado.idCliente).set(dados)

  }

  getConfiguracao()
  {
    return this.DB.collection('contasEmail').doc(this.global.dadosLogado.idCliente).get()
  }

  AddTest(tipo:string)
  {
    const dadosTest ={
      empresaUid:this.global.dadosLogado.idCliente,
      tipo,
      situacao:0,
      msg:''
    }
    return this.DB.collection('contasEmailTest').add(dadosTest)
  }
  getTest(uid:string)
  {
    return this.DB.collection('contasEmailTest').doc(uid).valueChanges()
  }
  deleteTest(uid:string)
  {
    return this.DB.collection('contasEmailTest').doc(uid).delete()
  }
}
