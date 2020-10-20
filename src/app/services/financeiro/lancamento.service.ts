import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Itlancamento } from 'src/app/interface/financeiro/lancamento';
import { AuthService } from '../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from '../global/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  private itemsCollection: AngularFirestoreCollection<Itlancamento>;
  public lancamentoDb: any;
  private currentUser:any;
  private idCliente:string;

  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth,
    private afFunction:AngularFireFunctions

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    

  }
  getAll()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('lancamentos',ref=>ref.where('isCancelado','==',false).orderBy('vencimento','asc')).snapshotChanges().pipe(
      map((action:any) => action.map((a:any)=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  getLancamento(uid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').doc(uid).get()
  }
  parcelaAdd(pedidoUid:string,dados:any)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros_notas').collection(pedidoUid).add(dados)
  }
  parcelaGetAll(pedidoUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros_notas').collection(pedidoUid).get()
  }
  parcelaDelete(pedidoUid:string,parcelaUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros_notas').collection(pedidoUid).doc(parcelaUid).delete()
  }

  lancamentoReprocessar(uid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').doc(uid).set({situacaoCod:0,situacaoNome:'Pendente',msgErro:''},{merge:true})
  }
  lancamentoUpdate(uid:string,dados:any)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').doc(uid).update(dados)
  }
  lancamentoCancelar(uid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').doc(uid).set(
      {
        isCancelado:true,
        cancelamentoUsuarioUid:this.afa.auth.currentUser.uid,
        cancelamentoUsuarioNome:this.afa.auth.currentUser.displayName
      },{merge:true})
  }
  lancamentoNewSQL(params:any)
  {
    const parametrosDados = {
      empresaUid:this.global.dadosLogado.idCliente,
      ... params
    }
    const callable = this.afFunction.httpsCallable('appFinanceiroAdd');
    
    const obs = callable(parametrosDados)
    return obs
    //obs.subscribe(async (res:any) => {
  }

  recorrenciaAdd(dados:any)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    dados.valor = Number(dados.valor)
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('recorrencia').add(dados)
  }

  recorrenciaGetAll()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('recorrencia').snapshotChanges().pipe(
      map((action:any) => action.map((a:any)=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  recorrenciaGet(recorrenciaUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('recorrencia').doc(recorrenciaUid).get()
  }
  recorrenciaAtualizar(recorrenciaUid:string,dados:any)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    dados.valor = Number(dados.valor)
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('recorrencia').doc(recorrenciaUid).set(dados,{merge:true})
  }
  recorrenciaDelete(recorrenciaUid:string)
  {

    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('recorrencia').doc(recorrenciaUid).delete()

  }



  gerarFiltro(sqlQUery:any)
  {
    this.idCliente      = this.global.dadosLogado.idCliente;
    const parametrosDados = {
      sql:'SELECT  UNIX_TIMESTAMP(vencimento) as vencimento,parceiroNome,valor,situacao,lancamentoUid,c_d FROM lara.'+this.idCliente+'_financeiro_lancamentos  '+sqlQUery
    }
    //console.log(parametrosDados.sql)
    const callable = this.afFunction.httpsCallable('appSQLexecute');
    
    const obs = callable(parametrosDados)
    return obs
    //obs.subscribe(async (res:any) => {
  }
  lancamentoDash(c_d):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      try
      {
        this.idCliente      = this.global.dadosLogado.idCliente;
        let sqlQUery = "select SUM(valor) as total from lara."+this.idCliente+"_financeiro_lancamentos WHERE situacao = '0' and c_d like '"+c_d+"';"
        const parametrosDados = {
          sql:sqlQUery
        }
        const callable = this.afFunction.httpsCallable('appSQLexecute');
        
        const obs = callable(parametrosDados)
        obs.subscribe(dados=>{
          
          if(dados.situacao == 'suc')
          {
              const dataReturn = dados.data.data[0][0]
              
              if(dataReturn)
              {
                let total = dataReturn.total
            
                if(total === null)
                {
                 
                  total = 0;
                }
                const dadosRetorno = {
                  total
                }
                resolve(dadosRetorno)
              }
          }
          else
          {
            const dadosRetorno = {
              total:0
            }
            resolve(dadosRetorno)
          }
        
        })
      }
      catch(err)
      {
        console.log(err)
        const dadosRetorno = {
          total:0
        }
        resolve(dadosRetorno)

      }
      
    })
    
  
    //obs.subscribe(async (res:any) => {
  }
  lancamentoNew(dados:any):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      this.idCliente      = this.global.dadosLogado.idCliente;
      dados.createAt      = new Date().getTime()
      dados.empresaUid    = this.idCliente
      dados.situacaoNome  = ''
      const vencimentoRecuperado = dados.vencimento.split('-')
      const timestamp = new Date(Number(vencimentoRecuperado[0]), Number(vencimentoRecuperado[1])-1, Number(vencimentoRecuperado[2])).getTime();
      dados.vencimento = timestamp
      dados.usuarioNome = this.afa.auth.currentUser.displayName
      dados.usuarioUid = this.afa.auth.currentUser.uid
      dados.valor_principal = Number(dados.valor_principal)

      //CHECK DE DEBITO
      if(dados.c_d == 'credito')
      {
        //VERIFICACOES DE CREDITO
        //CHECAR SE TEM BOLETO
        if(dados.libBoleto)
        {
          dados.situacaoNome  = 'Pendente'
        }
        else
        {
          dados.situacaoNome = 'Ag. recebimento'
        }
      }
      else
      {
        //CHECAR SE TEM BOLETO
        dados.libBoleto = false
        
        dados.situacaoNome = 'Ag. Pagamento'
      }
      

      
      // /QmPJcDIMLJBshGe9LDv2/dados/financeiro/registros/lancamentos/tPmUrsOIx1hbW1eqRhaN
      this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').add(dados)
      .then(res=>{
        resolve(res)
      })
      .catch(err=>{
        reject(err)
      })
       
    })
    

  }

  

}
