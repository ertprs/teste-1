import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Conversas } from 'src/app/interface/chat/conversas';
import { AuthService } from '../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from '../global/user.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ServAtendimentoService {

  private itemsCollection: AngularFirestoreCollection<Conversas>;
  public lancamentoDb: any;
  private currentUser:any;
  private idCliente:string;

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth
  ) { 
    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Conversas>(this.idCliente).doc('chat').collection('conversasfinalizadas');
    this.DB = DB;
  }

  add(dados:Conversas)
  {
    dados.createAt = new Date().getTime();
  
    return this.itemsCollection.add(dados);
  }
  update(id: string, dados: Conversas) {
    return this.itemsCollection.doc<Conversas>(id).update(dados);
  }
  getDadosAtenddimento()
  {
    try
    {
      let atendQtdLara        = 0;
      let atenQtdAtendimento  = 0;
      let atenEmAtendimento   = 0;

      const retorno = {
        situacao:'suc',
        code:0,
        msg:'processado com sucesso',
        data:{
          atendQtdLara,
          atenQtdAtendimento,
          atenEmAtendimento
        }
      }

      return retorno;
    }
    catch(err)
    {
      const retorno = {
        situacao:'err',
        code:0,
        msg:'Falha ao recuperar dados de atendimento '+err
      }

      return retorno;
    }
  }
  getAll()
  {
    return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Conversas;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  getFilterDate(date:number,date2:number) {
    return this.DB.collection<Conversas>(this.idCliente).doc('chat').collection('conversasfinalizadas',ref => ref.where('createAt', '>=', date).where('createAt', '<=', date2)).snapshotChanges().pipe(
      map(action => action.map(a => {
        const data = a.payload.doc.data() as Conversas;
        const id = a.payload.doc.id;
        return {id, ...data}
      }))
    )
  }
  getFilterDateConversas(date:number,date2:number) {
    return this.DB.collection<Conversas>(this.idCliente).doc('chat').collection('conversas',ref => ref.where('createAt', '>=', date).where('createAt', '<=', date2)).snapshotChanges().pipe(
      map(action => action.map(a => {
        const data = a.payload.doc.data() as Conversas;
        const id = a.payload.doc.id;
        return {id, ...data}
      }))
    )
  }
 
  getFilterDateConversasComerciais(date:number,date2:number) {

    
    return this.DB.collection<Conversas>(this.idCliente).doc('chat').collection('conversas',ref => ref.where('intencao','==','COMERCIAL').where('createAt', '>=', date).where('createAt', '<=', date2)).snapshotChanges().pipe(
      map(action => action.map(a => {
        const data = a.payload.doc.data() as Conversas;
        const id = a.payload.doc.id;
        return {id, ...data}
      }))
    )
  }
  delete(id: string) {
    return this.itemsCollection.doc(id).delete();
  }
  get(id: string) {
    return this.itemsCollection.doc<Conversas>(id).valueChanges();
  }
  getDadosAtendimento()
  {
    return this.DB.collection<Conversas>(this.idCliente).doc('chat').collection('conversas').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Conversas;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  async getFilterDateClassificacao(date:number,date2:number) {
    const dadosClassificacao = [];
    console.log('###### INICIO ######');
    try {
      const vContatos = await this.DB.firestore.collection(this.idCliente).doc('chat').collection('contatos').get();
      if(!vContatos.empty) {
        for(const contato of vContatos.docs) {

          const vMensagens = await this.DB.firestore.collection(this.idCliente).doc('chat').collection('conversas').doc(contato.id).collection('mensagens').get();
          if(!vMensagens.empty) {
            
            const arrMsgFilter = vMensagens.docs.filter(item => item.data().intencaoNome !== undefined && item.data().intencaoNome !== '');
            arrMsgFilter.forEach(element => {
              
              let adicionar = true;
              for(const classificacao of dadosClassificacao) {
                if(classificacao.nome === element.data().intencaoNome) {
                  classificacao.qtd++;
                  adicionar = false;
                }
              }
              if(adicionar) {
                dadosClassificacao.push({
                  nome: element.data().intencaoNome,
                  qtd: 1,
                  perc: 0
                });
              }

            });
          }
        }
      }
    } catch(err){
      console.log(err.message);
    }
    console.log('###### FIM ######');
    if(dadosClassificacao.length > 0) {
      let qtdTotal = 0;
      for(const classificacao of dadosClassificacao) qtdTotal += classificacao.qtd;
      for(const classificacao of dadosClassificacao) {
        classificacao.perc = (classificacao.qtd / qtdTotal * 100).toFixed(2);
      }
    }
    return dadosClassificacao;
  }




  // -> INICIO  WHATSAPP 

  async wppTemplateAdd(dados)
  {
    this.idCliente = this.global.dadosLogado.idCliente;

    const addItem = {
      createAt: new Date().getTime(),
      usuarioUid:this.afa.auth.currentUser.uid,
      usuarioNome:this.afa.auth.currentUser.displayName,
      aprovado:false,
      situacao:0,
      ... dados
    }
    return this.DB.collection(this.idCliente).doc('dados').collection('wpp_template').add(addItem)
  }

  async wppTemplateGetAll()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('wpp_template').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  async wppTemplateDelete(uid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('wpp_template').doc(uid).delete()
  }

  // <- FIM WHATSAPP
}
