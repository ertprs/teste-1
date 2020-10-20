import { Injectable } from '@angular/core';
import { AuthService } from '../seguranca/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServrelatoriosService {

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth
    
  ) { }

  gerarPedidoRelatorio(nome:string,param:any)
  {
    const idCliente = this.global.dadosLogado.idCliente;
    const dadosInsert = {
      nome,
      situacao:0,
  
      param
    }
    return this.DB.collection(idCliente).doc('dados').collection('solicitacoes_internas').doc(this.afa.auth.currentUser.uid).collection('relatorios').add(dadosInsert)
  }
  getProcessoRelatorio(id:string)
  {
    const idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(idCliente).doc('dados').collection('solicitacoes_internas').doc(this.afa.auth.currentUser.uid).collection('relatorios').doc(id)
  }

  
}
