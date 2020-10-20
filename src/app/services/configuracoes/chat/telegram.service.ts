import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';

import { Telegram } from 'src/app/interface/configuracoes/chat/telegram';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from '../../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  private itemsCollection: AngularFirestoreCollection<Telegram>;
  private currentUser:any;
  private idCliente:string;
  constructor(
    private auth:AuthService,
    private http:HttpClient,
    private DB:AngularFirestore,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Telegram>(this.idCliente).doc('dados').collection('configuracao')
  }

  add(dadosTelegram:Telegram)
  {
    dadosTelegram.createAt = new Date().getTime();
    dadosTelegram.empresaUid = this.idCliente;
    dadosTelegram.ambiente = environment.firebase.projectId;
    return this.itemsCollection.doc('chat').collection('telegram').add(dadosTelegram);
  }

  update(id : string, dadosTelegram : Telegram){
    return this.itemsCollection.doc('chat').collection('telegram').doc<Telegram>(id).update(dadosTelegram);
  }

  count(): Promise<number>
  {
    return new Promise((resolve) => {
      this.itemsCollection.doc('chat').collection('telegram').get().subscribe( data=> {
        
        console.log('qtd2 = '+data.size);
        resolve(data.size);
      });
    })
  }

  delete(id: string) {
    return this.itemsCollection.doc('chat').collection('telegram').doc(id).delete();
  }

  get()
  {
    //   return this.itemsCollection.doc('chat').collection('telegram',ref=>
    //     ref.where('empresaUid','==',this.idCliente)
    //   ).get().subscribe(dados=>{
    //     if(!dados.empty)
    //     {
    //       let dadosretorno = [];
    //       dados.forEach(elem=>{
    //         console.log(elem);
    //         const id = elem.id;
    //         const data = elem.data()
    //         const retorno = {id,... data}
    //         dadosretorno.push(retorno)
    //       })

    //     }
    // });

    return this.itemsCollection.doc('chat').collection('telegram',ref=>
      ref.where('empresaUid','==',this.idCliente)
    ).snapshotChanges().pipe(
      map(action => action.map(a=>{
        console.log(a);
        const data = a.payload.doc.data() as Telegram;
        const id = a.payload.doc.id;
        const doc = a.payload.doc;
        return {id, ... data, doc}
      }))
    )
  }

  getAll():Promise<any>
  {
    return new Promise((resolve, reject) => {
      return this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('chat').collection('telegram').get().forEach(dados=>{
        if(!dados.empty)
        {
          if(dados.docs.length == 1)
          {
            dados.docs.forEach(documentos=>{
              const id = documentos.id;
              const data = documentos.data();
              const dadosMerge = {id,... data}
              resolve(dadosMerge)
            })


          }
          else
          {
            reject('Confito detectado')
          }
          
          
        }
        else
        {
          reject('Nao existe configuracao');
        }
      })
    })

     
  }

  setWebHook(dadosTelegram:Telegram) : Promise<any>{

    return new Promise((resolve, reject) => {
      let uidEmpresa = this.idCliente;
      let url_ = 'https://us-central1-'+environment.firebase.projectId+'.cloudfunctions.net';
   

      let urlWebHook = url_+'/api/telegram/'+uidEmpresa;
      let url = 'https://api.telegram.org/bot'+dadosTelegram.token+'/setwebhook?url='+urlWebHook;
      let option = {};
      let header = {}
      this.http.get(url);


      this.http.get(url, option).subscribe(
        result=>{
          console.log(result)
          let data = result;

         
          let situacao = data["result"]
          if(data["result"])
          {
            let retorno = {
              situacao:'suc',
              code:0,
              msg: data['description']
            }
            resolve(retorno);
          }
          else
          {
            let retorno = {
              situacao:'err',
              code:0,
              msg:'Falha ao sincronizar token ('+uidEmpresa+') '+JSON.stringify( data["description"])+' - '+urlWebHook
            }
            resolve(retorno);
          }


          resolve(data)
        },
        error=>{
          
  
          let retorno = {
            situacao:'err',
            code:0,
            msg:'Fatal error :  Falha ao sincronizar token '+JSON.stringify( error )
          }
          resolve(retorno);
        }
      )
      
    
    })
    
    
  }
}
