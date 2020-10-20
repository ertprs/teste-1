import { NotificacoesService } from 'src/app/services/notificacoes/notificacoes.service';
import { TransferenciaService } from './transferencia.service';
import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/global/user.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../seguranca/auth.service';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';
import { Itempresa } from 'src/app/interface/configuracoes/itempresa';
import { Conversas } from 'src/app/interface/chat/conversas';
import { Itencaminharmensagem } from 'src/app/interface/chat/itencaminharmensagem';
import { AngularFireFunctions } from '@angular/fire/functions';
@Injectable({
  providedIn: 'root'
})
export class ConversasService {
  private itemsCollection: AngularFirestoreCollection<Conversas>;
  private currentUser:any;
  private idCliente:string;
  public startAfter:any = '';

  public conversas = new Array<Conversas>();

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth,
    private srvTransferencia:TransferenciaService,
    private srvNoticacao:NotificacoesService,
    private afFunction:AngularFireFunctions
  ) 
  { 
    console.log('Carregar dados de conversas')
    this.idCliente = this.global.dadosLogado.idCliente;
    console.log('Service conversas'+this.idCliente);
    this.itemsCollection = DB.collection<Conversas>(this.idCliente)
  }
  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
  get(id: string) {
    return this.itemsCollection.doc('chat').collection('conversas').doc<Conversas>(id).valueChanges();
  }

  update(id: string, dados: Conversas) {
    return this.itemsCollection.doc('chat').collection('conversas').doc<Conversas>(id).update(dados);
  }

  LiberarRoletagem(id: string, dados: Conversas) {

    dados.slaAgAtendimento  = true;
    dados.slaPainel         = false;
    dados.slaAlerta         = true;

    return this.itemsCollection.doc('chat').collection('conversas').doc<Conversas>(id).update(dados);
  }

  checkCanaisConfigurados()
  {
    try
    {
      return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc<Itempresa>('empresa').valueChanges();
    }
    catch(err)
    {
      console.log(err)
    }
    
  }
  async atendimentoListar(query?:QueryFn)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('chat').collection('conversas',query).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Conversas;
        const id = a.payload.doc.id;
        return {id, ... data};
      }))
    );
  }
  async atendimentoListarFiltro2(queryStr?:QueryFn)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    console.log(queryStr)
    
    return this.DB.collection(this.idCliente).doc('chat').collection('conversas',queryStr).snapshotChanges()
  }
  private CalcularDiff(dt2:Number, dt1:Number) 
  {
    try
    {
      var diff =(<any>dt2 - <any>dt1);
      //diff /= (60 * 60);
      
      //diff = diff / 60000;
      return Math.floor(diff/1000/60)
      //return Math.abs(Math.round(diff));
    }
    catch(err)
    {
      return 0;
    }
   
    
  }
  async atendimentoListarFiltro(queryStr?:QueryFn)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    console.log(queryStr)
    
    return this.DB.collection(this.idCliente).doc('chat').collection('conversas',queryStr).snapshotChanges().pipe(
      map(action => action.map(a=>{

        const data = a.payload.doc.data() as Conversas;
        const id = a.payload.doc.id;
        const tagSemRespostaTime = this.CalcularDiff( new Date().getTime(), data.ultMensagemData );
        const tempoAdmitido = Number(this.global.dadosLogado.confEmpAtendimento.atdMinAlerta);

        

        let selecionado = false
        const dataInsert = {
          selecionado,
          id,
          tagSemRespostaTime,
          tempoAdmitido,
          ... data
        }
        return dataInsert

       
      }))
    )
  }
  async checkLembreteContato(contatoUid:string):Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.idCliente = this.global.dadosLogado.idCliente;
      this.DB.collection(this.idCliente).doc('chat').collection('lembretes',ref => ref.where('contatoUid','==',contatoUid)).get().subscribe(dados=>{
        if(!dados.empty)
        {
          const qtd = dados.docs.length
          dados.docs.forEach(element=>{
            const id = element.id;
            const dataElement = element.data();
            const data = {id,... dataElement}
            resolve({qtd,data})
          })
        }
        else
        {
          resolve({qtd:0})
        }
      })
    })
  }


  getAllUser()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    console.log('Listando conversas de  '+this.idCliente);
    return this.DB.collection<Conversas>(this.idCliente).doc('chat').collection('conversas',ref => ref.where('usuarioUid','==',this.afa.auth.currentUser.uid).where('situacao','==',2)).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Conversas;
        const id = a.payload.doc.id;
        return {id, ... data};
      }))
    );
  }

  getAll()
  {
    return this.itemsCollection.doc('chat').collection('conversas').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const doc = a.payload.doc;
        const data = a.payload.doc.data() as Conversas;
        const id = a.payload.doc.id;
        return {id, ... data, doc};
      }))
    )
  }

  getAllAtivas()
  {
    return this.itemsCollection.doc('chat').collection('conversas',ref => ref.where('situacao','>',0).where('situacao','<',4)).snapshotChanges().pipe(
      map(action => action.map(a=>{
          const doc = a.payload.doc;
          const data = a.payload.doc.data() as Conversas;
          const id = a.payload.doc.id;
          console.log(data);
          return {id, ... data, doc};
        }))
      )
  }

  getFilter(valor:string)
  {
    // return this.itemsCollection.doc('chat').collection('conversas',ref=> ref.orderBy('usuarioNome').startAt(valor.toUpperCase()).endAt(valor.toLowerCase()+ '~').limit(10)).get();
    return this.itemsCollection.doc('chat').collection('conversas', ref => ref.orderBy('usuarioNome').startAt(valor.toUpperCase()).endAt(valor.toLowerCase()+'\uf8ff')).get();
  }

  async endChat(contatoUid:string,conversaUid:string,updateData:any) {
    try {
      await this.itemsCollection.doc('chat').collection('conversas').doc(conversaUid).set(updateData, {merge: true});
      
      const doc:any = await this.itemsCollection.doc('chat').collection('conversas').doc(conversaUid).get();
      doc.forEach(async element => {
        const result:any = await this.itemsCollection.doc('chat').collection('conversasfinalizadas').doc(conversaUid).set(element.data());
      });
      
      await this.itemsCollection.doc('chat').collection('contatos').doc(contatoUid).set({situacao: 1}, {merge: true});

      await this.itemsCollection.doc('chat').collection('conversas').doc(conversaUid).delete();
      
      return {situacao:'suc',code:0,msg:'Conversa encerrada com sucesso.'}
    } catch(err) {
      return {situacao:'err',code:0,msg:'endChat err:'+err.message};   
    }
  }
  
  finalizarAtendimento(conversaUid:string,motivo:string,contatoUid:string,supervisao:boolean):Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.idCliente = this.global.dadosLogado.idCliente;
      const jsonSend ={
        usuarioDestinoNome:'',
        usuarioOrigemUid:this.afa.auth.currentUser.uid,
        usuarioOrigemNome:this.afa.auth.currentUser.displayName,
        conversaUid,
        motivo

      }
      this.DB.collection(this.idCliente).doc('chat').collection('autofinalizacao').add(jsonSend)
      .then(()=>{
        resolve()
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  TransferirConversaEnviar(conversaUid:string,motivo:string,contatoUid:string,destUsuarioUid:string,destUsuarioNome:string,supervisao:boolean): Promise<any>{
    return new Promise((resolve, reject) => {
      this.idCliente = this.global.dadosLogado.idCliente;
    
        
        //ADD TRANSFEReNCIA

        const jsonSend ={
          usuarioDestinoNome:destUsuarioNome,
          usuarioOrigemUid:this.afa.auth.currentUser.uid,
          usuarioOrigemNome:this.afa.auth.currentUser.displayName,
          conversaUid,
          motivo

        }

        this.srvTransferencia.add(jsonSend)
        .then(retTransferencia=>{
          let idTransf = retTransferencia.id

          //UPDATE DE SITUACAO DE CONVERSA MOSTrAr QUE ESTA EM PROCESSO DE TRANSFERENCIA
          const dadosUpdadeConversa = {
            situacao:2,
            transferenciaUid:idTransf,
            usuarioNome:destUsuarioNome,
            usuarioUid:destUsuarioUid
          }
          this.updateTransferencia(conversaUid,dadosUpdadeConversa)
          .then(retUpTransferencia=>{
            if(supervisao)
            {
              //FEITO POR SUPERVISAO TIRAR O ALERT DA TELA
              resolve()
            }
            else
            {
               //GERAR NOTIFICACAO
              const dadosNotificacao = {
                createAt: new Date().getTime(),
                tipo: 'transferencia',
                tipoId: idTransf,
                contatoUid: contatoUid,
                finalizado: false,
                titulo: 'Nova transferência de atendimento',
                mensagem: `Você recebeu uma transferência de atendimento de ${this.afa.auth.currentUser.displayName}${motivo}`,
              } 
              this.srvNoticacao.add(destUsuarioUid,dadosNotificacao)
              .then(retNotificacao=>{
                resolve()
              })
              .catch(err=>{
                console.log(err)
                reject(err)
              })
            }
           
          })
          .catch(errTransferencia=>{
            reject(errTransferencia)
          })
      })
    
      //ADICIONAR NOTIFIACCAO AO USUARIO
    })
  }
  
  agendarChat(dados:any): Promise<any>{
    return new Promise((resolve, reject) => {
      const dadosAgendamento = {
        createAt: new Date().getTime(),
        usuarioUid: this.afa.auth.currentUser.uid,
        contatoUid: dados.id,
        tipo: 'chat',
        situacao: 2
      }
      this.itemsCollection.doc('chat').collection('conversasAgendadas').add(dadosAgendamento)
      .then(res=>{
        resolve();
      })
      .catch(err=>{
        console.log(err);
        reject();
      })


    })
  }

  startChat(dados:any): Promise<any>{
    return new Promise((resolve, reject) => {
  
    console.log('Start conversa')
    if(dados.situacao == 2)
    {
      
      console.log(dados)
        
       //OCUPADO
        if(dados.usuarioUid == this.afa.auth.currentUser.uid)
        {
          console.log('Dono da conversa')
          const retorno = {
            conversaUid :dados.conversaUid,
            contatoUid : dados.id,
            situacao: dados.situacao
          }
          
          resolve(retorno)
        }
        else
        {
          console.log('Não tem permissão para seguir '+this.afa.auth.currentUser.uid);
          const retorno = {
            situacao:'err',
            code:1,
            msg:'Contato está ocupado'
          }
          reject(retorno);
        }
        
    }
    else
    {
      let nomeClienteVinculado = ''
      let uidClienteVinculado = '';
      if(dados.nomeClienteVinculado !== undefined)
      {
        nomeClienteVinculado = dados.nomeClienteVinculado;
      }

      if(dados.uidClienteVinculado !== undefined)
      {
        uidClienteVinculado = dados.uidClienteVinculado;
      }
        const jsonSend = {
          contatoNome: dados.nome,
          contatoUid: dados.id,
          contatoOrigem: dados.origem,
          createAt: new Date().getTime(),
          favorito: dados.favorito,
          photo: dados.photo,
          situacao: 2,
          canal: dados.canal,
          conversao: 0,
          intencao: '',
          qtdA: 0,
          usuarioNome: this.afa.auth.currentUser.displayName,
          usuarioUid: this.afa.auth.currentUser.uid,
          nomeClienteVinculado:nomeClienteVinculado,
          uidClienteVinculado: uidClienteVinculado
        };
        
        this.itemsCollection.doc('chat').collection('conversas').add(jsonSend)
        .then(res=>{

          this.itemsCollection.doc('chat').collection('contatos').doc(dados.id).set({situacao:2,usuarioUid:jsonSend.usuarioUid,conversaUid:res.id}, {merge: true})
          .then(resUpdateContato=>{
            const retorno = {
              conversaUid :res.id,
              contatoUid : dados.id,
              situacao: dados.situacao
            }
            resolve(retorno)
          })
          .catch(errUpdateContato=>{
            console.log(errUpdateContato)
            const retorno = {
              situacao:'err',
              code:0,
              msg:errUpdateContato
            }
            reject(retorno);
          })

          
        })
        .catch(err=>{
          console.log(err)
          const retorno = {
            situacao:'err',
            code:0,
            msg:err
          }
          reject(retorno);
        })
    }
    })
  }

  updateTransferencia(id: string, dados: any) {
    return this.itemsCollection.doc('chat').collection('conversas').doc(id).set(dados, {merge: true});
  }

  conversaVerificar(dados:any):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      this.idCliente = this.global.dadosLogado.idCliente;
      const callable = this.afFunction.httpsCallable('appConversaCheck')
      
      const dadosCheck = {
        empresaUid:this.idCliente,
        contatoUid:dados.dadosContato.uid
      }

      const obs = callable(dados)
      obs.subscribe(retornoCall=>{
        resolve(retornoCall)
      })
    })
   
  }
  conversaIniciar(dados:any):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      this.idCliente = this.global.dadosLogado.idCliente;

      

      

      const dadosContato = dados.dadosContato

      if(dadosContato.favorito == 2)
      {
        dadosContato.favorito = false
      }
      else
      {
        dadosContato.favorito = true
      }

      const dadosIniciarConversa = {
        canal:dados.canal.toLowerCase(),
        contatoNome:dadosContato.nome,
        contatoOrigem:dadosContato.origem_wpp,
        contatoUid:dadosContato.uid,
        conversao:0,
        createAt:new Date().getTime(),
        favorito:dadosContato.favorito,
        intencao:'',
        nomeClienteVinculado:dadosContato.parceiroNome,
        photo:this.getRandomColor(),
        qtdA:0,
        situacao:2,
        sqlAgAtendimento:false,
        uidClienteVinculado:dadosContato.parceiroUid,
        usuarioNome:this.afa.auth.currentUser.displayName,
        usuarioUid:this.afa.auth.currentUser.uid
      }
  
      this.DB.collection(this.idCliente).doc('chat').collection('conversas').add(dadosIniciarConversa)
      .then(resSuccess=>{
        resolve(resSuccess)
      })
      .catch(err=>{
        reject(err)
      })
    })
  }

}
