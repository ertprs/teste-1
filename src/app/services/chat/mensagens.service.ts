

import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AuthService } from '../seguranca/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensagens } from 'src/app/interface/chat/mensagens';

import { map } from 'rxjs/operators';
import { Conversas } from 'src/app/interface/chat/conversas';
import { ConversasService } from './conversas.service';
import { Subscription } from 'rxjs';
import { Itencaminharmensagem } from 'src/app/interface/chat/itencaminharmensagem';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class MensagensService {
  
  private itemsCollection: AngularFirestoreCollection<Mensagens>;
  private conversasCollection : AngularFirestoreCollection<Conversas>;
  private messageEncaminharCollection : AngularFirestoreCollection<Itencaminharmensagem>;
  private currentUser:any;
  private idCliente:string;
  
  private dadosConversa: Conversas = {};
  private ConversaSubscription: Subscription;

  public forwardActive : boolean = false;
  public messagesToFoward : any[] = [];
  
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private afa:AngularFireAuth,
    private serviceConversas:ConversasService,
    private global:UserService
    
  ) { 

    this.idCliente =  this.idCliente = this.global.dadosLogado.idCliente;
    console.log('Init. service mensagens '+this.idCliente);
    console.log('Set User '+this.idCliente);
    console.log(this.idCliente);
    this.itemsCollection = DB.collection<Mensagens>(this.idCliente);
    this.conversasCollection = DB.collection<Conversas>(this.idCliente);
    this.messageEncaminharCollection  = DB.collection<Itencaminharmensagem>(this.idCliente);
  }
  
  SendEncaminhar(dadosEncaminhar:Itencaminharmensagem)
  {
      //{empresaUid}/chat/encaminhamento/{encaminhamentoUid
      dadosEncaminhar.createAt = new Date().getTime();
      dadosEncaminhar.processado = false;
      return this.messageEncaminharCollection.doc('chat').collection('encaminhamento').add(dadosEncaminhar);
  }

  async SendMesg(conversaUid:string,dados:Mensagens): Promise<Boolean>
  {
    return new Promise((resolve, reject) => {
      if(dados.canal!='')
      {
        dados.createAt = new Date().getTime();
        dados.entregueData = null;
        dados.entregueTag = 0;
        dados.enviadoData = new Date().getTime();
        dados.enviadoTag = 1;
        dados.es = 's';
        dados.conversaUid = conversaUid;
        dados.usuarioNome = this.afa.auth.currentUser.displayName;
        dados.usuarioUid = this.afa.auth.currentUser.uid;
        dados.autorNome = this.afa.auth.currentUser.displayName;
        dados.autorUid = this.afa.auth.currentUser.uid;
        dados.lidoTag = 2;
        dados.lidoData = null;
        console.log('Iniciar envio ... '+JSON.stringify(dados)); 

        //ATUALIZAR TEMPO DA CONVERSA DA ULTIMA MENSAGEM
        this.itemsCollection.doc('chat').collection('conversas').doc(dados.conversaUid ).set({ultMensagemData:0},{merge:true})
        .then(resUpConversa=>{
          this.itemsCollection.doc('chat').collection('conversas').doc(dados.contatoUid).collection('mensagens').add(dados)
          .then((res)=>{
            console.log('Enviada com sucesso');

            //UPDATE DE MARCAR COMO EM ATENDIMENTO 
            this.dadosConversa.slaAlerta = false;
            this.serviceConversas.update(conversaUid,this.dadosConversa)
            .then(resUpdate=>{
              resolve(true);
            })
            .catch(err=>{
              console.log(err)
              resolve(false)
            })
          })
          .catch((err)=>{
            console.log('[Err] Falha ao enviar mensagem '+err);
            resolve(false)
          })
        })
        .catch(errConversa=>{
          console.log(errConversa)
          resolve(false)
        })
      }
      else
      {
        console.log('Nao existem dados da conversa');
        resolve(false);
      }
    });
  }




  get(id: string) {
    return this.itemsCollection.doc('chat').collection('contatos').doc<Mensagens>(id).valueChanges();
  }
  getMensagens(contatoUid:string)
  {
    console.log('Listadndo mensagens de '+contatoUid);
    return this.itemsCollection.doc('chat').collection('conversas').doc(contatoUid)
    .collection('mensagens',ref => ref.limit(20).orderBy('createAt',"desc") )
    .snapshotChanges().pipe(
      map(action => action.map(a=>{
        
        const data = a.payload.doc.data() as Mensagens;
        const uid = a.payload.doc.id;     
        
        return {uid, ... data}

      }))
    )
  }

  forwardMessage(){
    this.forwardActive == false ? this.forwardActive = true : this.forwardActive = false;
  }

  cancelForward(){
    this.forwardActive = false;
  }

  //COMENTARIO PARA REMOVER 


}



