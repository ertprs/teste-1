
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/global/user.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/seguranca/auth.service';

import { Contatos } from 'src/app/interface/chat/contatos';
import { Observable, combineLatest } from 'rxjs';
import { database } from 'firebase';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class ContatosService {
  private itemsCollection: AngularFirestoreCollection<Contatos>;
  private currentUser:any;
  private idCliente:string;
  private contatoDb:any;
  public startAfter:any = '';

  public firstInResponse: any = [];

  //Save last document in snapshot of items received
  public lastInResponse: any = [];

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth,
    private afFunction:AngularFireFunctions

  ) { 
    this.idCliente = this.global.dadosLogado.idCliente;
    console.log('Global '+this.idCliente)    

    this.contatoDb = DB.firestore.collection(this.idCliente).doc('chat').collection('contatos');
    this.itemsCollection = DB.collection<Contatos>(this.idCliente)
  }
  //NOVAS FUNCOES
  transmissaoAbortar(listaUid:string,transmissaoUid:string):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      this.idCliente = this.global.dadosLogado.idCliente
      this.DB.collection(this.idCliente).doc('chat').collection('lista_transmissao_detalhe').doc(listaUid).collection('envio').doc(transmissaoUid).set({situacaoCod:9,situacaoNome:'Envio cancelado'},{merge:true})
      .then(()=>{
        this.DB.collection(this.idCliente).doc('chat').collection('lista_transmissao').doc(listaUid).set({situacao:0,situacaoNome:'Parada'},{merge:true})
        .then(()=>{
          resolve()
        })
        .catch(errUpdate2=>{
          reject(errUpdate2)
        })
      })
      .catch(errUpdate=>{
        reject(errUpdate)
      })
    })
    
   
  }
  listaTransmicaoAdd(dados:any)
  {
    dados.createAt = new Date().getTime()
    dados.usuarioUid = this.afa.auth.currentUser.uid
    dados.usuarioNome = this.afa.auth.currentUser.displayName
    dados.situacao = 0
    dados.situacaoNome = "Parada"
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('chat').collection('lista_transmissao').add(dados)
  }
  listaTransmissaoGetAll()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('chat').collection('lista_transmissao',ref=>ref.orderBy('createAt','desc')).get()
  }
  listaTransmissaoGet(uid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('chat').collection('lista_transmissao').doc(uid).get()
  }
  listaTransmissaoDetalheGetAll(listaUid:string)
  {
    return this.DB.collection(this.idCliente).doc('chat').collection('lista_transmissao_detalhe',ref=>ref.orderBy('createAt','desc')).doc(listaUid).collection('envio').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Contatos;
        const id = a.payload.doc.id;
        const doc = a.payload.doc;
        return {id, ... data,doc}
      }))
    )
  }
  listaPrepararEnvio(listaUid:string,dadosLista:any):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      this.idCliente = this.global.dadosLogado.idCliente;
      let sql = "SELECT * FROM lara.contatos WHERE empresaUid like '"+this.idCliente+"' and grupo like  '"+dadosLista.grupo+"'  ORDER by nome "
      const callable = this.afFunction.httpsCallable('appSQLexecute');
      const obs = callable({ sql });
      obs.subscribe(dadosRetorno=>{
        if(dadosRetorno.situacao == 'suc')
        { 
       
          
          const dataReturnDestinatarios = dadosRetorno.data.data[0]
          if(dataReturnDestinatarios.length > 0)
          {
            //console.log(dataReturnDestinatarios)
            //ADD NA LISTA DE TRANSMISSAO
            const dadosDetalheEnvio = {
              createAt:new Date().getTime(),
              usuarioNome:this.afa.auth.currentUser.displayName,
              usuarioUid:this.afa.auth.currentUser.uid,
              qtdDestinatarios:dataReturnDestinatarios.length,
              qtdEnvioWPP:0,
              qtdEnvioSMS:0,
              qtdEnvioEmail:0,
              situacaoCod:0,
              situacaoNome:'Aguardando inicio'
            }
            

          


            //ADD DETALHES DE LISTA NO FIREBASE 
            this.DB.collection(this.idCliente).doc('chat').collection('lista_transmissao_detalhe').doc(listaUid).collection('envio').add(dadosDetalheEnvio)
            .then(resDetalhe=>{
              //ADD NO MUSQL
              const callable2 = this.afFunction.httpsCallable('listaTransmissaoDetalheAdd');
              const dadosDetalheSQL = {
                empresaUid:this.idCliente,
                listUid:resDetalhe.id,
                dados:dataReturnDestinatarios
              }
              const obs2 = callable2(dadosDetalheSQL);
              obs.subscribe(dadosReturnAddDetalhe=>{
                

                this.DB.collection(this.idCliente).doc('chat').collection('lista_transmissao').doc(listaUid).set({situacao:1,situacaoNome:'Ag. Envio'},{merge:true})
                .then(resUpdate=>{

                  //ADD CRON START TRANSMISSAO
                  const dadosCron ={
                    createAt:new Date().getTime(),
                    usuarioNome:this.afa.auth.currentUser.displayName,
                    usuarioUid:this.afa.auth.currentUser.uid,
                    listaUid,
                    transmissaoUid:resDetalhe.id,
                    situacao:0
                  }
                  this.DB.collection(this.idCliente).doc('chat').collection('cron').add(dadosCron)
                  .then(()=>{
                    resolve(dadosReturnAddDetalhe)
                  })
                  .catch(err=>{
                    reject(err)
                  })

                  
                })
                .catch(errUpdate=>{
                  reject('Falha ao atualizar situacao da lista de transmissão')
                })

                
              })

             
            })
            .catch(errDetalhe=>{
              reject(errDetalhe)
            })
          }
          else
          {
            reject('Não existem contatos vinculados ao grupo/subgrupo informado')
          }
        }
        else
        {
          reject('Falha ao iniciar preparação da lista')
        }
        
      }) 
    })
  }
  conversasBackup(contatoNumero:string):Promise<any>
  {
      return new Promise((resolve,reject)=>{
        this.idCliente = this.global.dadosLogado.idCliente;
        this.DB.collection('EmpControle',ref=> ref.where('empresaUid','==',this.idCliente)).get().forEach(element=>{
          if(!element.empty)
          {
            const data = element.docs[0].data()
            const identiCliente = data.documento
            console.log('Identificacao empresa '+identiCliente)
            //let sql = "SELECT * FROM chat.conversas WHERE id_cliente = '"+identiCliente+"' and id_origem = '"+contatoNumero+"' order by id desc LIMIT 0,1000"
            let sql = "SELECT (UNIX_TIMESTAMP(data)*1) as dataStamp,id,mensagem,link,pidUser,data FROM chat.conversas WHERE id_cliente = '"+identiCliente+"' and id_origem = '"+contatoNumero+"' order by id desc LIMIT 0,1000"  
         
            const callable = this.afFunction.httpsCallable('appSQLexecuteBackup');
            const obs = callable({ sql });
            obs.subscribe(dadosRet=>{
              resolve(dadosRet)
            })
          }
          else
          {
            reject('Não existem configuração para está empresa')
          }
        })
       
      })
      
  }
  contatosGet(params:any)
  {
    const parametrosDados = {
      empresaUid:this.global.dadosLogado.idCliente,
      ... params
    }
    const callable = this.afFunction.httpsCallable('appContatosConsulta');
    
    const obs = callable(parametrosDados)
    return obs
    //obs.subscribe(async (res:any) => {
  }
  contatoCheckADMIN(dados:any)
  {
   
     
        
        console.log(dados)
  
        const callable = this.afFunction.httpsCallable('appContatoAdd')
        
        const obs = callable(dados)
        return obs
     
      
  
    
    
  }
  contatoCheck(dados:any)
  {
   
     
        dados.empresaUid  = this.global.dadosLogado.idCliente 
        
        console.log(dados)
        const callable = this.afFunction.httpsCallable('appContatoAdd')
        
        const obs = callable(dados)
        return obs
     
      
  
    
    
  }
  contatoAtualizar(contatoUid:string,dados:any)
  {


 

    return  this.DB.collection(this.global.dadosLogado.idCliente).doc('chat').collection('contatos').doc(contatoUid).set(dados,{merge:true})
  }
  contatoAdd(dados:any):Promise<any>
  {
    return new Promise((resolve, reject) => {
      try
      {
        dados.usuarioUid    = this.afa.auth.currentUser.uid
        dados.usuarioNome   = this.afa.auth.currentUser.displayName
        dados.createAt      = new Date().getTime()
        dados.sincronizado  = 0
        dados.situacao      = 1
        dados.msgErr        = ''
        this.DB.collection(this.global.dadosLogado.idCliente).doc('chat').collection('contatos').add(dados)
        .then(res=>{
          resolve(res.id)
        })
        .catch(err=>{
          reject(err)
        })
      }
      catch(err)
      {
        reject(err)
      }

    })
  }
  contatoDelete(uid:string)
  {
    console.log(uid)
    return this.DB.collection(this.idCliente).doc('chat').collection('contatos').doc(uid).delete()
  }
  contatoGetDetalhe(uid:string):Promise<any>
  {
    return new Promise((resolve, reject) => {
      try
      {
        resolve(this.DB.collection(this.idCliente).doc('chat').collection('contatos').doc(uid).get())
      }
      catch(err)
      {
        console.warn(err)
        reject('Falha ao abrir dados do contato')
      }
     
    })
    ///QmPJcDIMLJBshGe9LDv2/chat/contatos/QmPJcDIMLJBshGe9LDv2_frikcam0o
    
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
  canaisGet():Promise<any>
  {
    return new Promise((resolve, reject) => {
      ///QmPJcDIMLJBshGe9LDv2/dados/configuracao/chat/watson
      const canais= []
      this.idCliente = this.global.dadosLogado.idCliente;
      this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('chat').collection('wppchatapi').get().forEach(dados=>{
        let qtd = 0;
        if(!dados.empty)
        {
          qtd++
        }
        this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('chat').collection('twilio').get().forEach(dados2=>{
          let qtdTwilio = 0
          if(!dados2.empty)
          {
            qtd++
          }

          resolve(qtd)
        })
      })
    })
    
  }
  checkCadastro(origem:string,canal:string):Promise<any>
  {
    return new Promise((resolve, reject) => {
      console.log('Check verify '+origem+' -> '+canal);
      let total = 0;
      this.itemsCollection.doc('chat').collection('contatos', ref => ref.where('origem', '==', origem)).valueChanges()
      .forEach(dados=>{
        dados.forEach(elem=>{
          total++;
        })
      
        resolve(total)
      })
    })
  }
  async Select(queryStr?:QueryFn)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    
    
    return this.DB.collection(this.idCliente).doc('chat').collection('contatos',queryStr)
  }
  atualizarGrupos(id:string,grupo:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    
    
    return this.DB.collection(this.idCliente).doc('chat').collection('contatos').doc(id).set({grupo},{merge:true})
  
  }

  gruposList()
  {
    //LISTA DE GRUPOS SQL
    this.idCliente = this.global.dadosLogado.idCliente;
    let sql = "SELECT grupo FROM lara.contatos WHERE empresaUid like '"+this.idCliente+"' and grupo <> '' GROUP BY grupo ORDER by grupo "
    const callable = this.afFunction.httpsCallable('appSQLexecute',);
    const obs = callable({ sql });
    return obs 
  
  }

  async contadorContatos(): Promise<number>
  {
    return new Promise((resolve, reject) => {
      this.idCliente = this.global.dadosLogado.idCliente;
      this.DB.collection(this.idCliente).doc('chat').collection('contatos').get().forEach(documentos=>{
        if(!documentos.empty)
        {
            const qtd = documentos.docs.length
            resolve(qtd)
        }
        else
        {
          resolve(0)
        }
  
      })
    })
    
    
  }
  dataAtualFormatada(dataInf?:string){
    var data = new Date(),
        dia  =  Number(data.getDate().toString().padStart(2, '0')),
        //mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        mes  = Number((data.getMonth().toString().padStart(2, '0'))), 
        ano  = Number(data.getFullYear());
      
        var ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
        const returno ={
          data,
          dia,
          mes,
          ano,
         
          ultimoDia
        }
        return returno;
       
    
  }
  async contadorAniversariantes(): Promise<any>
  {
    return new Promise((resolve, reject) => {
      
      try
      {
        this.idCliente = this.global.dadosLogado.idCliente;
        let  data = this.dataAtualFormatada()
        
  
        let mes = new Date().getMonth()+1
        console.log('Buscando pelo m6es '+mes)
        
        this.DB.collection(this.idCliente).doc('chat').collection('contatos',ref=> ref.where('dtNascimentoMes','==',mes)).get().forEach(documentos=>{
       
          if(!documentos.empty)
          {
              const dataRetorno = [];
              documentos.docs.forEach(data=>{
                const dataLinha = {
                  id:data.id,
                  ...
                  data.data()
                }
                dataRetorno.push(dataLinha)
              })
              const retorno ={
                qtd:documentos.docs.length,
                data:dataRetorno
              }
              
              resolve(retorno)
          }
          else
          {
            const dataRetorno = [];
            const retorno ={
              qtd:0,
              data:dataRetorno
            }
            
            resolve(retorno)
          }
    
        })
      }
      catch(err)
      {
        reject(err)
      }
      
    })
    
    
  }
  async contadorUltimos(): Promise<any>
  {
    return new Promise((resolve, reject) => {
      
      try
      {
        this.idCliente = this.global.dadosLogado.idCliente;
        let  data = this.dataAtualFormatada()
        
  
        let dtFinal = this.dataAtualFormatada().data.getTime()
        let dtInicial = this.dataAtualFormatada().data
        let dt2 = dtInicial.setDate(dtInicial.getDate()-30)
      
        console.log(dtFinal)
        
        
        this.DB.collection(this.idCliente).doc('chat').collection('contatos',ref=> ref.where('createAt','>=',dt2 ).where('createAt','<=',dtFinal)).get().forEach(documentos=>{
          if(!documentos.empty)
          {
              const dataRetorno = [];
              documentos.docs.forEach(data=>{
                const dataLinha = {
                  id:data.id,
                  ...
                  data.data()
                }
                dataRetorno.push(dataLinha)
              })
              const retorno ={
                qtd:documentos.docs.length,
                data:dataRetorno
              }
              
              resolve(retorno)
          }
          else
          {
            const dataRetorno = [];
            const retorno ={
              qtd:0,
              data:dataRetorno
            }
            
            resolve(retorno)
          }
    
        })
      }
      catch(err)
      {
        reject(err)
      }
      
    })
    
    
  }
  async contadorBloqueado(): Promise<any>
  {
    return new Promise((resolve, reject) => {
      
      try
      {
        this.idCliente = this.global.dadosLogado.idCliente;
       
        
        
        this.DB.collection(this.idCliente).doc('chat').collection('contatos',ref=> ref.where('bloqueado','==',true )).get().forEach(documentos=>{
          if(!documentos.empty)
          {
              const dataRetorno = [];
              documentos.docs.forEach(data=>{
                const dataLinha = {
                  id:data.id,
                  ...
                  data.data()
                }
                dataRetorno.push(dataLinha)
              })
              const retorno ={
                qtd:documentos.docs.length,
                data:dataRetorno
              }
              
              resolve(retorno)
          }
          else
          {
            const dataRetorno = [];
            const retorno ={
              qtd:0,
              data:dataRetorno
            }
            
            resolve(retorno)
          }
    
        })
      }
      catch(err)
      {
        reject(err)
      }
      
    })
    
    
  }
  add(contato:Contatos): Promise<any>
  {
    return new Promise((resolve, reject) => {
      
      contato.createAt = new Date().getTime();
      contato.photo =this.getRandomColor();
      contato.situacao = 5;
      contato.uidClienteVinculado = null;
      contato.nome = contato.nome.toUpperCase().trim();

      contato.usuarioUid = this.afa.auth.currentUser.uid;
      contato.usuarioNome = this.afa.auth.currentUser.displayName;
      
      let contador = 0;
      this.itemsCollection.doc('chat').collection('contatos',ref => ref.where('origem', '==', contato.origem).where('canal','==',contato.canal)).get().forEach(elem=>{
        if(!elem.empty)
        {
          contador = elem.docs.length;
        }
      })
      .then(resCheck=>{
        if(contador == 0)
        {
          //AUTORIzAR CADAStro
          if(contato.canal === 'whatsapp') {
            contato.situacao = 3;
          }
          this.itemsCollection.doc('chat').collection('contatos').add(contato)
          .then((resAdd)=>{
            resolve(resAdd.id)
          })
          .catch(err=>{
            let retorno = {
              situacao:'err',
              code:0,
              msg:err
            }
            reject(retorno)
          })
        }
        else
        {
          let retorno = {
            situacao:'err',
            code:1,
            msg:'Contato já cadastrado'
          }
          reject(retorno)
        }
      })
          
    })
  }

  getData(id: string) {
    return this.contatoDb.doc(id).get();
  }
  
  update(id: string, contato: Contatos) {
    contato.updateInterno = true;
    contato.nome =  contato.nome.toUpperCase().trim();
    console.log(contato)
    return this.itemsCollection.doc('chat').collection('contatos').doc<Contatos>(id).update(contato);
  }

  liberarContato(id: string, contato: Contatos) {
    return this.itemsCollection.doc('chat').collection('contatos').doc<Contatos>(id).update(contato);
  }

  getAll2()
  {
    return this.itemsCollection.doc('chat').collection('contatos',ref=> 
      ref.orderBy('nome','asc')
      .startAfter(this.startAfter).limit(10)).get().subscribe(response=>{

      });
  }

  getCount():Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.itemsCollection.doc('chat').collection('contatos').get().forEach(dados=>{
        resolve(dados.docs.length)
      })
    });
  }

  getFilter(valor:string,campo:string)
  {
    console.log('Pesquisar em '+campo+'  contendo '+valor)
    if(campo == 'nome')
    {
      return this.itemsCollection.doc<Contatos>('chat').collection('contatos',ref=> ref.orderBy('nome','asc').startAt(valor.toUpperCase()).endAt(valor.toLowerCase()+ '~').limit(20)).get()
    }
    else
    {
      return this.itemsCollection.doc<Contatos>('chat').collection('contatos',ref=> ref.orderBy('origem').startAt(valor.toUpperCase()).endAt(valor.toLowerCase()+ '~').limit(10)).get()
    }
  }


  GetListasTransmissao()
  {
      return this.itemsCollection.doc<Contatos>('chat').collection('contatos',ref=> ref.where('canal','==','lista')).get()
  
   
    
  }
  
  
  getFirst()
  {
    return this.itemsCollection.doc('chat').collection('contatos',ref=> 
    ref.orderBy('nome','asc')
    .limit(50)).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const doc = a.payload.doc;
        const data = a.payload.doc.data() as Contatos;
        const id = a.payload.doc.id;
        return {id, ... data,doc}
      }))
    )
  }

  getAll()
  {
    console.log('Iniciando no registro'+this.startAfter)
    return this.itemsCollection.doc('chat').collection('contatos',ref=> 
    ref.orderBy('nome','asc')
    .startAfter(this.startAfter)
    .limit(50)).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Contatos;
        const id = a.payload.doc.id;
        const doc = a.payload.doc;
        return {id, ... data,doc}
      }))
    )
  }

  getAllFull()
  {
    return this.itemsCollection.doc('chat').collection('contatos', ref => ref.orderBy('nome')).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Contatos;
        const id = a.payload.doc.id;
        const doc = a.payload.doc;
        return {id, ... data,doc}
      }))
    )
  }
  
  get(id: string) {
    console.log('Dados do contato abrindo '+id);
    return this.itemsCollection.doc('chat').collection('contatos').doc<Contatos>(id).valueChanges();
  }
  delete(id: string) {
    return this.itemsCollection.doc('chat').collection('contatos').doc(id).delete();
  }
  contatoSpamAdd(params:any)
  {

    const parametrosDados = {
      empresaUid:this.global.dadosLogado.idCliente,
      ... params
      
    }



      const callable = this.afFunction.httpsCallable('appContatoSpam');
    
      const obs = callable(parametrosDados)

   return obs

  
   
    
  }
}
