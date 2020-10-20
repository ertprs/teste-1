import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ConversaIA } from 'src/app/interface/lara/conversa-ia';
import { AuthService } from '../seguranca/auth.service';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class WatsonService {
  private itemsCollection: AngularFirestoreCollection<ConversaIA>;
  private currentUser:any;
  private idCliente:string;
  constructor(
    private http:HttpClient,
    private auth:AuthService,
    private DB:AngularFirestore,
    private afa:AngularFireAuth,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    
    
    this.itemsCollection = DB.collection<ConversaIA>('lara');
  }

  add(dados:ConversaIA)
  {
    dados.createAt = new Date().getTime();
    dados.textReturn = "";
    dados.empresaUid = this.idCliente;
 
    let userUid = this.afa.auth.currentUser.uid;
    return this.itemsCollection.doc(userUid).collection('dialogos').add(dados);
  }
  get(id: string) {
    let userUid = this.afa.auth.currentUser.uid;
    return this.itemsCollection.doc(userUid).collection('dialogos').doc<ConversaIA>(id).valueChanges();
  }
  update(id: string, dados: ConversaIA) {
    let userUid = this.afa.auth.currentUser.uid;
    return this.itemsCollection.doc(userUid).collection('dialogos').doc<ConversaIA>(id).update(dados);
  }

  ProcessarTexto(): Promise<any> 
  {
    return new Promise((resolve, reject) => {
      let apikey  = 'apikey:l1wwpPbPxKL6pFuc8hm2j7xjoBqJ5B1kNuKAgXPPlka-';
    
      let workId  = '5383f048-eaed-4d1e-960e-1dec833e871f';
      let context = '';
      let version = '2019-02-28';

      const json = {
        input: { text: 'oi' },
        context: context,
      };


      

      const url   = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/message?version=${version}`;
      const httpOptions = {
        headers: new HttpHeaders({
            'Authorization': 'Basic'+btoa(apikey)
        })
      };
      

      this.http.post(url,httpOptions).subscribe(
        result=> {
          console.log(result);
          resolve( result );
        },
        error=> {
          let result = {
            situacao : 'err',
            code : 2,
            msg: 'Erro na requisição'+error.error.message
          }
          
          reject(result)
        }
      );
    });
    
      



 

    
  }
}

