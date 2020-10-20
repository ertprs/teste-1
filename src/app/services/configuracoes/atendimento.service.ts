import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Itconfatendimento } from 'src/app/interface/configuracoes/itatendimento';
import { AuthService } from '../seguranca/auth.service';
import { UserService } from '../global/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  private itemsCollection: AngularFirestoreCollection<Itconfatendimento>;

  private currentUser:any;
  private idCliente:string;

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Itconfatendimento>(this.idCliente).doc('dados').collection('configuracao');
  }
  getAll()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return  this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('atendimentoAutoAtendimento').get()
  }
  updateMsgAuto(dados:any):Promise<any>
  { 
    return new Promise((resolve, reject) => {
      this.idCliente = this.global.dadosLogado.idCliente;
      this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('atendimentoAutoAtendimento').get().forEach(elem=>{
        if(elem.exists)
        {
          elem.ref.update(dados)
          this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('atendimentoAutoAtendimento').set(dados)
          .then(res=>{
            resolve()
          })
          .catch(errAdd=>{
            reject(errAdd)
          })
          
        }
        else
        {
          //CRIAR NOVA CONFICURACA
          this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('atendimentoAutoAtendimento').set(dados)
          .then(res=>{
            resolve()
          })
          .catch(errAdd=>{
            reject(errAdd)
          })
        }
      })
    })
    
    
  }
  update(dados: Itconfatendimento) {
    return this.itemsCollection.doc('atendimento').set(dados,{merge:true});
  }
  delete() {
    return this.itemsCollection.doc('atendimento').delete();
  }
  get() {
    return this.itemsCollection.doc<Itconfatendimento>('atendimento').valueChanges();
  }

  getAllConfDepartamentos()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('atend').collection('departamentos',ref => ref.orderBy('nome','asc')).get()
  }

  getCasosTipo(departamentoUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('atend').collection('casosTipo', ref => ref.where('departamentoUid','==',departamentoUid).orderBy('nome','asc')).get()
  }

  getAllAtendimento(queryStr?:QueryFn)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('chat').collection('conversas',queryStr).get()
  }
  relatorioCasos(queryStr?:QueryFn)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('ticket',queryStr).get()
  }

  //GESTAO DE CASOS
  casoAdd(dadosCaso:any)
  {
    this.idCliente            = this.global.dadosLogado.idCliente;
    dadosCaso.usuarioUid      = this.afa.auth.currentUser.uid
    dadosCaso.usuarioNome     = this.afa.auth.currentUser.displayName
    dadosCaso.dataAbertura    = new Date().getTime()
    dadosCaso.dataModificacao = new Date().getTime()
    dadosCaso.novo            = 1
    dadosCaso.numero          = 0
   
    dadosCaso.createAt        = new Date().getTime()
    return this.DB.collection(this.idCliente).doc('dados').collection('ticket').add(dadosCaso)
  }
  casoRegistrarEvento(casoUid:string,dados:any):Promise<any>
  {
      return new Promise((resolve,reject)=>{
        this.idCliente      = this.global.dadosLogado.idCliente;
        dados.usuarioUid    = this.afa.auth.currentUser.uid
        dados.usuarioNome   = this.afa.auth.currentUser.displayName
        dados.createAt      = new Date().getTime()
        dados.situacao      = 0
        dados.msg           = ''
        dados.assinatura    = '<br>'+this.afa.auth.currentUser.displayName+'<br>Atendimento'
         
        this.DB.collection(this.idCliente).doc('dados').collection('ticket_detalhe').doc(casoUid).collection('interacoes').add(dados)
        .then(resAdd=>{

          //UPDATE DO STATUS NOVO DO PEDIDO E QUANTIDADES NAO LIDAS 
          this.DB.collection(this.idCliente).doc('dados').collection('ticket').doc(casoUid).set({qtdA:0,novo:0},{merge:true})
          .then(resUpdate=>{
            resolve()
          })
          .catch(errUpdate=>{
            reject(errUpdate)
          })

        })
        .catch(errAdd=>{
          reject(errAdd)
        })


      })

  }

  getCasosPorOperador2()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('ticket')
  }
  async getCasosPorOperador(query?:QueryFn)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('ticket',query).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data};
      }))
    );
  }

  async getCasoDetalhe(casoUid:string, query?:QueryFn)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('ticket_detalhe').doc(casoUid).collection('interacoes',query).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data};
      }))
    );
  }
  async casoFinalizar(casoUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('ticket').doc(casoUid).set({ situacao:6 },{merge:true})
  }



  casoGet(casoUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('ticket').doc(casoUid).get()
  }
  casoDelete(casoUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('ticket').doc(casoUid).delete()
  }

  

 
}
