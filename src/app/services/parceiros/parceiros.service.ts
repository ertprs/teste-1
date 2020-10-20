import { UserService } from 'src/app/services/global/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Itaddparceiro } from 'src/app/interface/parceiros/add/itaddparceiro';
import { AuthService } from '../seguranca/auth.service';
import { map } from 'rxjs/operators';
import axios from 'axios';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class ParceirosService {
  private itemsCollection: AngularFirestoreCollection<Itaddparceiro>;
  private currentUser:any;
  private idCliente:string;


  
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private afa:AngularFireAuth,
    private global:UserService,
    private afFunction:AngularFireFunctions,

    ) { 
  
      this.idCliente = this.global.dadosLogado.idCliente;

    this.itemsCollection = DB.collection<Itaddparceiro>(this.idCliente);
  }

  generateColor() {
    let color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
  
  verificarSeExisteDocumentoBackup(empresaUid:string,documento:string):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      const callable = this.afFunction.httpsCallable('appParceiroVerificarSeExiste',);
      const obs = callable({ empresaUid,documento});

    
      obs.subscribe(async (res:any) => {
       resolve(res)
      })
    })
    
  }
  verificarSeExisteDocumento(documento:string):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      const callable = this.afFunction.httpsCallable('appParceiroVerificarSeExiste',);
      const obs = callable({ empresaUid:this.global.dadosLogado.idCliente,documento});

    
      obs.subscribe(async (res:any) => {
       resolve(res)
      })
    })
    
  }
  addBackup(empresaUid:string,dados:any)
  {
    dados.createAt = new Date().getTime();
 
    dados.userUid = this.afa.auth.currentUser.uid
    dados.usuarioNome = this.afa.auth.currentUser.displayName


    return this.DB.collection(empresaUid).doc('dados').collection('parceiros').add(dados);
  }
  add(dados:any)
  {
    dados.createAt = new Date().getTime();
    this.idCliente = this.global.dadosLogado.idCliente;
    dados.userUid = this.afa.auth.currentUser.uid
    dados.usuarioNome = this.afa.auth.currentUser.displayName


    return this.DB.collection(this.idCliente).doc('dados').collection('parceiros').add(dados);
  }

  update(parceiroId : string, parceiro : Itaddparceiro) {
    return this.itemsCollection.doc('dados').collection('parceiros').doc<Itaddparceiro>(parceiroId).update(parceiro);
  }

  get(parceiroId : string){
    return this.itemsCollection.doc('dados').collection('parceiros').doc<Itaddparceiro>(parceiroId).valueChanges();
  }

  getAll()
  {

    
    return this.itemsCollection.doc('dados').collection('parceiros').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itaddparceiro;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  parceirosGet(parceiroUid:string):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      this.idCliente = this.global.dadosLogado.idCliente;
      this.DB.collection(this.idCliente).doc('dados').collection('parceiros').doc(parceiroUid).get().forEach(element=>{
        if(element.exists)
        {
          const id = element.id
          const dados = element.data()
          const dadosRet = {
            id,
            ... dados
          }
          resolve(dadosRet)
        }
        else
        {
          reject()
        }
      })
      
    })
    
    
  }
  parceiroAtualizar(parceiroUid:string,dados:any)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('parceiros').doc(parceiroUid).set(dados,{merge:true})
  }
  parceirosGetAll()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('parceiros').get()
  }
  parceiroDelete(parceiroUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection(this.idCliente).doc('dados').collection('parceiros').doc(parceiroUid).delete()

  }

  delete(parceiroId: string){
    return this.itemsCollection.doc('dados').collection('parceiros').doc(parceiroId).delete();
  }
  parceiroConsulta(consultarPor:string):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      const callable = this.afFunction.httpsCallable('appParceiroConsulta',);
      const obs = callable({ empresaUid:this.global.dadosLogado.idCliente,buscarpor:consultarPor});

    
      obs.subscribe(async (res:any) => {
       resolve(res)
      })
    })
    
  }
  checkCidade(uf:string):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      try
      {
        const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+uf.toUpperCase()+'/distritos'


   
        axios.get(url)
        .then(function (response) {
          // handle success
          resolve({situacao:'suc',code:0,msg:'Consulta realizada com sucesso',data:response.data})
        })
        .catch(function (error) {
          // handle error
          reject({situacao:'err',code:0,msg:'Falha ao consultar CPF. | '+error })
        })
      }
      catch(err)
      {
        reject(err)
      }
    })
  }


  checkCEPv2(cep:string):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      
      const url = 'https://viacep.com.br/ws/'+cep+'/json/'
       
        axios.get(url)
        .then(function (response) {
          // handle success
          console.log(response)
          
            const dataResponse = response.data
            const dadosRetorno = {
              cep:dataResponse.cep,
              logradouro:dataResponse.logradouro,
              complemento:dataResponse.complemento,
              bairro:dataResponse.bairro,
              localidade:dataResponse.localidade,
              uf:dataResponse.uf,
              ibge:dataResponse.ibge,
              gia:dataResponse.gia,
              ddd:dataResponse.ddd,
              siafi:dataResponse.siafi
            } 
            
            resolve({situacao:'suc',code:0,msg:'Consulta realizada com sucesso',data:dadosRetorno})
          
         
        })
        .catch(function (error) {
          // handle error
          reject({situacao:'err',code:0,msg:'Falha ao consultar CPF. | '+error })
        })
    })
  }

  checkCPF(documento:string,dtNascimento:string):Promise<any>
  {
    
    return new Promise((resolve,reject)=>{
      try
      {

       

        
        const url = 'https://ws.hubdodesenvolvedor.com.br/v2/cpf/?cpf='+documento+'&data='+dtNascimento+'&token=10541935wZkRFKyzUt19033144&ignore_db'
      
        axios.get(url)
        .then(function (response) {
          // handle success
          resolve({situacao:'suc',code:0,msg:'Consulta realizada com sucesso',data:response.data})
        })
        .catch(function (error) {
          // handle error
          reject({situacao:'err',code:0,msg:'Falha ao consultar CPF. | '+error })
        })
        
      }
      catch(err)
      {
        reject({situacao:'err',code:1,msg:'Falha ao consultar CPF. Serviço indisponivel' })
      }
    })
  }
  checkCNPJ(documento:string):Promise<any>
  {
    
    return new Promise((resolve,reject)=>{
      try
      {
       
        axios.get('https://ws.hubdodesenvolvedor.com.br/v2/cnpj/?cnpj='+documento+'&token=10541935wZkRFKyzUt19033144')
        .then(function (response) {
          // handle success
          resolve({situacao:'suc',code:0,msg:'Consulta realizada com sucesso',data:response.data})
        })
        .catch(function (error) {
          // handle error
          reject({situacao:'err',code:0,msg:'Falha ao consultar CPF. | '+error })
        })
        
      }
      catch(err)
      {
        reject({situacao:'err',code:1,msg:'Falha ao consultar CPF. Serviço indisponivel' })
      }
    })
  }
  consultaCEP(cep:string):Promise<any>
  {
    
    return new Promise((resolve,reject)=>{
      try
      {
        
        axios.get('https://ws.hubdodesenvolvedor.com.br/v2/cep3/?retorno=json&cep='+cep+'&token=10541935wZkRFKyzUt19033144')
        .then(function (response) {
          // handle success
          resolve({situacao:'suc',code:0,msg:'Consulta realizada com sucesso',data:response.data})
        })
        .catch(function (error) {
          // handle error
          reject({situacao:'err',code:0,msg:'Falha ao consultar CPF. | '+error })
        })
        
      }
      catch(err)
      {
        reject({situacao:'err',code:1,msg:'Falha ao consultar CPF. Serviço indisponivel' })
      }
    })
  }
}