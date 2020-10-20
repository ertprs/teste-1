import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { resolve } from 'url';
import { UserService } from '../global/user.service';
import { AuthService } from '../seguranca/auth.service';
import { ServiceempresasService } from './serviceempresas.service';

@Injectable({
  providedIn: 'root'
})
export class ServempresaService {
  private idCliente:string;
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private fireAuth:AngularFireAuth,
    private serviceEmpresa:ServiceempresasService,
    private global:UserService,
    private afFunction:AngularFireFunctions
  ) { }

  getConfiguracoes()
  {
    ///QmPJcDIMLJBshGe9LDv2/dados/configuracao/empresa
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('empresa').get()
  }
  gravarConfiguracoes(dados:any)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('empresa').set(dados,{merge:true})
  }
  gravarConfiguracoesTokenEnotas(token:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('empresa').set({eNotasUid:token},{merge:true})
  }
  processarEmpresaEnotas()
  {
  
   
        const callable = this.afFunction.httpsCallable('appFiscalEnotasCriarEmpresa')
        const dados ={
          empresaUid:this.global.dadosLogado.idCliente
        }
        const obs = callable(dados)
        return obs
       
      

    
 
  }
}
