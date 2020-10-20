
import { ItConfigWatson } from './../../interface/configuracoes/chat/it-config-watson';
import { Injectable } from '@angular/core';
import { Aprendizado } from 'src/app/interface/lara/aprendizado';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { Exemploia } from 'src/app/interface/lara/aprendizado/exemploia';
import { UserService } from '../global/user.service';
import { ItMensagemProdutividade } from 'src/app/interface/chat/it-mensagem-produtividade';

@Injectable({
  providedIn: 'root'
})
export class AprendizadoService {

  private itemsCollection: AngularFirestoreCollection<Aprendizado>;
  private currentUser:any;
  private idCliente:string;
  
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Aprendizado>(this.idCliente).doc('dados').collection('aprendizado')
  }

  addExemplo(uidAprendizado:string,dados:Exemploia)
  {
    dados.createAt = new Date().getTime();
   
    return this.itemsCollection.doc('exemplos').collection(uidAprendizado).add(dados);
  }
  //RETORNOS DE DADOS 
  getConfWatson()
  {
    console.log('Get configuration')
    try{
      return this.DB.collection<ItConfigWatson>(this.idCliente)
      .doc('dados')
      .collection('configuracao')
      .doc('chat')
      .collection('watson')
      .snapshotChanges().pipe(
        map(action => action.map(a=>{
          console.log('55555')
          const data = a.payload.doc.data() as ItConfigWatson;
          const id = a.payload.doc.id;
          return {id, ... data}
          
        }))
      )
    }
    catch(err)
    {
      console.log(err);
      console.log('Erro conf IA')  
    }
    
    
  }

  getProdutividade()
  {
    try
    {
      

      let dadosProdtiidade = this. DB.collection<ItMensagemProdutividade>(this.idCliente)
      .doc('chat')
      .collection('aprendizado')
      .doc('relatorios')
      .collection('produtividade')
      .snapshotChanges().pipe(
        map(action => action.map(a=>{
          const data = a.payload.doc.data() as ItMensagemProdutividade;
          const id = a.payload.doc.id;
          return {id, ... data}
        }))
      )
      

      let msgRecebida       = 0;
      let msgRespondidades  = 0;
      let percetual         = 0;

      dadosProdtiidade.forEach(elem=>{
        elem.forEach(dados=>{
          msgRecebida++;
          if(dados.processadoIA)
          {
            msgRespondidades++;
          }
        })
      })

      if(msgRecebida > 0 && msgRespondidades > 0)
      {
        percetual = (msgRecebida/msgRespondidades)*100
      }
      const retorno = {
        situacao:'suc',
        code:0,
        msg:'Processado com sucesso',
        data:{
          msgRecebida,
          msgRespondidades,
          percetual
        }
      }

      return retorno;

    }
    catch(err)
    {
      const retorno = {
        situacao:'err',
        code:0,
        msg:'Falha ao recuperar dados de produtividade '+err
      }

      return retorno;
    }
  }
  
  updateConfIA(dados: ItConfigWatson) {
    ///QmPJcDIMLJBshGe9LDv2/dados/configuracao/chat/watson/FxVDtKMaHwWez7lpnw6U
    return this.DB.collection<ItConfigWatson>(this.idCliente)
    .doc('dados')
    .collection('configuracao')
    .doc('chat')
    .collection('watson').doc<ItConfigWatson>(dados["id"]).update(dados)
    .then(res=>{
      console.log('certo')
      console.log(res)
    })
    .catch(err=>{
      console.log('err')
      console.log(err)
    })
  }
 
  
  getAllExemplos(uidAprendizado:string)
  {

    
    return this.itemsCollection.doc('exemplos').collection(uidAprendizado).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Exemploia;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  deleteExemplo(uidAprendizado:string,id: string) {
    return this.itemsCollection.doc('exemplos').collection(uidAprendizado).doc(id).delete();
  }


  add(dados:Aprendizado)
  {
    dados.createAt = new Date().getTime();
   
    return this.itemsCollection.add(dados);
  }
  update(id: string, dados: Aprendizado) {
    return this.itemsCollection.doc<Aprendizado>(id).update(dados);
  }
  getAll()
  {

    
    return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Aprendizado;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  get(id: string) {
    return this.itemsCollection.doc<Aprendizado>(id).valueChanges();
  }
  delete(id: string) {
    return this.itemsCollection.doc(id).delete();
  }
}
