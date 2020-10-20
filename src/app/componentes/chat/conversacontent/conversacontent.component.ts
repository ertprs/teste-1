import { PedidoDetProdutosPage } from './../../../models/comercial/pedido-det-produtos/pedido-det-produtos.page';
import { UserService } from 'src/app/services/global/user.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Mensagens } from 'src/app/interface/chat/mensagens';
import { Conversas } from 'src/app/interface/chat/conversas';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { ProcessosService } from 'src/app/services/design/processos.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ModalController, IonRouterOutlet, PopoverController, IonContent, Platform, LoadingController } from '@ionic/angular';

import { File } from '@ionic-native/file/ngx';
import { ViewimagePage } from 'src/app/modals/chat/mensagem/viewimage/viewimage.page';
import { PopovermensagensComponent } from 'src/app/popover/popovermensagens/popovermensagens.component';
import { PopovermensagemopcaoPage } from 'src/app/popover/popovermensagemopcao/popovermensagemopcao.page';
import { PopoveremojiPage } from 'src/app/popover/popoveremoji/popoveremoji.page';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';


import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { EncaminharPage } from '../../../pages/chat/encaminhar/encaminhar.page';
import { ChatMessageService } from 'src/app/provider/chat-message.service';
import { PgTodoAddPage } from 'src/app/pages/todo/add/pg-todo-add/pg-todo-add.page';


@Component({
  selector: 'app-conversacontent',
  templateUrl: './conversacontent.component.html',
  styleUrls: ['./conversacontent.component.scss'],
})
export class ConversacontentComponent implements OnInit{
  
  //DADOS TRANSPORTADOS
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild('msgBox', {static: false}) msgBoxCursor : HTMLElement;
  @Input() data: any;


  //VARIAVEIS
  private contatoUid: string = '';
  private contadorMsg: number = 0;

  private devicePlatform : string = 'desktop';
  private newMsg: string = '';
  private cleanMsg : string = '';
  private currentUser:any;
  private conversaUid:any;
  private dadosMensagem: Mensagens = {};
  private dadosConversa: Conversas = {};

  private chatHeader : string = 'chat-content';
  private buttonMessage : boolean = false;
  public  assumirAtendimento : boolean = true;


  private mensagens = new Array<Mensagens>();
  private forwardedMessages = new Array<Mensagens>();
  private forwardFilter : any[] = [];

  private itemsSubscription: Subscription;

  private forwardCheckbox : boolean = false;
  private hasMessageSelected : boolean = true;
  private allCheckboxes : boolean = false;

  private conversas = new Array<Conversas>();
  private conversaSubscription: Subscription;

  public ligarScroll2:Boolean = false;
  public  qtdContando:number =  0;


  public data2:number = 0;
  public qtdProdutosVisitados:number =0;
  public ProdutosVisitados:any[] = []

  public checkboxencaminhar:boolean = false;
  public lembreteToDoUid:string;

  private casoUid:string = ''


  private scrollAuto:boolean
  private scrollBtnVisible:boolean
  private scrollBtnVisible2:boolean
  private footerHidden: boolean;

  
  constructor(
    private auth:AuthService,
    private activeRoute: ActivatedRoute,
    private mensagensService: MensagensService,
    private conversaService:ConversasService,
    private design:ProcessosService,
    private router:Router,
    private afa:AngularFireAuth,
    private popoverController:PopoverController,
    private transfer: FileTransfer,
    private file:File,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private plataform:Platform,
    private eventEmitterService: ProvEmitterEventService,
    private ctrlLoading:LoadingController,
    private srvGlobal:UserService,
    private chatMessageService : ChatMessageService

  ) { 
    

   
    this.conversaSubscription = new Subscription;
    this.itemsSubscription = new Subscription;
    this.scrollAuto = false;


  }

  ngOnInit() {
    if (this.plataform.is('hybrid')) {
      this.devicePlatform = 'hybrid';
    }

  
    

    console.log('data')
    console.log(this.data)
    this.auth.getCUrrentUser()
    .then(dados=>{
      this.currentUser = dados;

       //Checando tipo de entrada de parametros
   
      //RECUPERAR PARAMETROS INTERNOS
      console.log('Params 2')
      this.contatoUid = this.data.contatoUid;
      this.conversaUid = this.data.conversaUid;
      this.assumirAtendimento = true;

      //SETAR CONVERsa ATIVAO
      this.srvGlobal.conversaUidAtiva = this.conversaUid;

      //VERIFICAR MENSAGEM
      if(this.srvGlobal.msgDigitando.length > 0)
      {
        this.chatMessageService.desktopMsg = '';
        this.srvGlobal.msgDigitando.forEach(dados=>{
          if(dados.conversaUid == this.conversaUid)
          {
            this.chatMessageService.desktopMsg = dados.texto;
          }
        })
      }
   



      this.conversaSubscription = this.conversaService.get(this.conversaUid).subscribe(data=>{
            
        this.dadosConversa = data;

       if(data.hasOwnProperty('casoUid'))
       {
         //SETAR CASO A CONVERSA
         this.casoUid = data.casoUid
       }


        this.forwardCheckbox = this.mensagensService.forwardActive;

        if(this.dadosConversa.produtosVisitados !== undefined)
        {
          this.qtdProdutosVisitados = this.dadosConversa.produtosVisitados.length;
          if( this.dadosConversa.produtosVisitados.length > 0)
          {
            this.chatHeader = 'chat-com-content';
            this.dadosConversa.produtosVisitados.forEach(dados=>{
              this.ProdutosVisitados.push(dados)
              
            })
          }
        }
        
        

        if(this.dadosConversa.usuarioUid == '')
        {
          if(this.assumirAtendimento)
          {
              //DEFINIR USUARIO PARA ESTA CONVERSA
              
              this.dadosConversa.usuarioUid = this.afa.auth.currentUser.uid;
              this.dadosConversa.usuarioNome = this.afa.auth.currentUser.displayName;
              this.dadosConversa.qtdA = 0;
              this.dadosConversa.slaAlerta = false;
              console.log(this.dadosConversa)
              this.conversaService.update(this.conversaUid,this.dadosConversa)
              .then(()=>{
                console.log('Atribuido conversa ao usuario ');
              })
              .catch((err)=>{
                console.log('Falha ao atribuir mensagem ao usuario '+err);
              })
              .finally(()=>{
                this.ctrlLoading.dismiss();
              })
          }
          
        
        }
        else
        {
          if(this.dadosConversa.usuarioUid == this.afa.auth.currentUser.uid)
          {
            //MARCAR COMO LIDO
         
          
            this.conversaService.update(this.conversaUid,{qtdA:0,slaAgAtendimento:false})
            .then(()=>{
              console.log('Conversa marcado como lido ');
            })
            .catch((err)=>{
              console.log('Falha ao marcar como lido');
            })
            .finally(()=>{
              
            })
          }
          
        }
        
      });
    })
  
    
   

  }
  OrdernarLista()
  {
    this.mensagens.sort(function(a,b) {
      return a.createAt < b.createAt ? -1 : a.createAt > b.createAt ? 1 : 0;
    });
  }
  executarAutoScrol()
  {
    if(!this.scrollBtnVisible2 )
    {
      setTimeout(()=>{
                    
        console.log('Acionar scrool em '+this.qtdContando)
     
        this.content.scrollToBottom(300);

      },200); 
    }
    else
    {
      this.scrollBtnVisible = true;
    }
  }
  clickRolagem()
  {
    this.scrollBtnVisible2 = false;
    this.scrollBtnVisible = false
    this.executarAutoScrol()
  }
  logScrollEnd()
  {
   // this.scrollBtnVisible = true;
   
  }
  logScrolling(event:any)
  {

    if (event.detail.deltaY > 0 && this.footerHidden) return;
    if (event.detail.deltaY < 0 && !this.footerHidden) return;
    if (event.detail.deltaY > 0) {
      //console.log("scrolling down, hiding footer...");
      this.footerHidden = true;
      this.scrollBtnVisible2 = false
     
    } else {
      this.scrollBtnVisible2 = true;
      //console.log("scrolling up, revealing footer...");
      this.footerHidden = false
      
    };
  }
  logScrollStart()
  {
    //this.scrollAuto = false
  }
  changeSource(event : Event, url : string) { 
    let fileName : string = url;
    fileName = fileName.split('/docmensagens/').pop();
    fileName = fileName.split('?GoogleAccessId=lara2-3b332').shift();
    event.target["src"] = `https://firebasestorage.googleapis.com/v0/b/lara2-3b332.appspot.com/o/R3k2QPodMaR5WdC8Vynz%2Fdocmensagens%2F${fileName}?alt=media&token=7fe4c23d-34e5-4a0f-adf1-a7ef1b07299c`; 
}
  async ngAfterViewInit(){
    this.design.presentLoading('Carregado mensagens...')
    .then( resLoadaing=>{
      resLoadaing.present();

        this.itemsSubscription = this.mensagensService.getMensagens(this.contatoUid).subscribe(data=>{
        
        let qtdMensagens = data.length;
        
        
        data.sort(function(a,b) {
          return a.createAt < b.createAt ? -1 : a.createAt > b.createAt ? 1 : 0;
        }).forEach(mensagemRecebida=>{
          
          
          let checkMensagem = this.mensagens.reduce( function( cur, val, index ){

            if( val.uid === mensagemRecebida.uid && cur === -1 ) {
                
              return index;
            }
            return cur;
        
          }, -1 );

          if(checkMensagem > -1)
          {
            //EXISTE - ATUALIZAR DADOS DA MENSAGEM
            
            this.mensagens[checkMensagem].entregueTag = mensagemRecebida.entregueTag;
            this.mensagens[checkMensagem].anexo = mensagemRecebida.anexo
            this.mensagens[checkMensagem].tipo = mensagemRecebida.tipo

            //SCROLL AQUI
            this.executarAutoScrol()
          }
          else
          { 
           
            //ADICIONAR MENSAGEM
            this.qtdContando = this.qtdContando + 1;
            //this.OrdernarLista()
          
            let add =  this.mensagens.push(mensagemRecebida)
            if(add)
            {
             
              if(this.qtdContando == qtdMensagens)
              {
              
              

                  //AUTO SCROLL
                  this.executarAutoScrol()
               
                
                
              }
              
              
            }
            else
            {
              alert(1)
            }
          
           
            

           
            
           
            


           
            
          }
        })
        
            
        




      
  
        
     
  
        
       
      
      })
    })
    .finally(()=>{
      this.ctrlLoading.dismiss();

      //VERIFICAR LEMBRETE
      this.conversaService.checkLembreteContato(this.contatoUid)
      .then(resLembrete=>{
        if(resLembrete.qtd > 0)
        {
          this.lembreteToDoUid   = resLembrete.data.todoUid;
        
        }
        
      })


    })
  }
  ngOnDestroy()
  {
    this.cancelForward();
    this.srvGlobal.conversaUidAtiva = null;
    console.log('Subscribe destroy');
    this.itemsSubscription.unsubscribe();
    this.conversaSubscription.unsubscribe();
  }
  async AbrirTodo(todoUid:string) {

    console.log('Abrir edit ');
    const modal = await this.modalController.create({
      component: PgTodoAddPage,
      showBackdrop:true,
      cssClass: 'selector-modal',
      componentProps: {
        tarefaUid:todoUid
      },
    });
    return await modal.present();
  }

  functionExecute(functionName:string,params:any)
  {

    

    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  abrirTicket()
  {
    this.functionExecute('compticketadd',{casoUid:this.casoUid})
  }
  async MarcarComoLido()
  {
     //ATUALIZAR COMO LIDO
     if(this.dadosConversa.usuarioUid == this.afa.auth.currentUser.uid)
     {
       this.conversaService.update(this.conversaUid,{qtdA:0})
       .then(()=>{
        
       })
       .catch((err)=>{
         console.log(err)
         this.design.presentToast('Falha ao atualizar mensagem como lida','danger',0,true)
       })
       .finally(()=>{
          

         
     
         
       })
     }
    
  }
  loadMessages(){
    
    

  }

  assumirConversa()
  {
     //DEFINIR USUARIO PARA ESTA CONVERSA
    this.assumirAtendimento = true;
    this.dadosConversa.usuarioUid = this.afa.auth.currentUser.uid;
    this.dadosConversa.usuarioNome = this.afa.auth.currentUser.displayName;
    this.dadosConversa.qtdA = 0;
    this.conversaService.update(this.conversaUid,this.dadosConversa)
    .then(()=>{
      console.log('Atribuido conversa ao usuario ');
    })
    .catch((err)=>{
      console.log('Falha ao atribuir mensagem ao usuario '+err);
    })
  }


  async Download(urlData:string)
  {


    if(this.plataform.is('hybrid'))
    {
      console.log('Download '+urlData);
      let url =  encodeURI(urlData);
      let dataAtual = new Date().getTime();
      let filename = 'laraDown'+dataAtual+url.split("/").pop();
      console.log('Nome '+filename);
  
      filename = 'texte.pdf';
  
  
      let dir_name = 'Download'
      let path = this.file.externalRootDirectory;
      const fileTransfer: FileTransferObject = this.transfer.create();
      let result = this.file.createDir(this.file.externalRootDirectory, dir_name, true);
      result.then((resp)=>{
        path = resp.toURL();
        console.log(path);
        fileTransfer.download(
          url,
          path+filename,
          true,
          {}
        )
        .then((entry)=>{
          console.log('download complete: ' + entry.toURL());
          this.design.presentToast(
            'Download realizado com sucesso! '+entry.toURL(),
            'success',
            3000
  
          )
          //alert('Suc)'+JSON.stringify(entry))
          //if(this.plataform.is('ios'))
          
          
    
        })
        .catch((err)=>{
          console.log('Err)'+JSON.stringify(err))
          this.design.presentToast(
            'Falha ao salvar arquivo '+err,
            'danger',
            4000
  
          )
        })
      })
    }
    else
    { 
      window.open(urlData,'_blank')
      
    }

    
  
  }
  
  async viewImage(url:string) {
    const modal = await this.modalController.create({
      component: ViewimagePage,
      componentProps: {
        'urlData': url,
      },
      swipeToClose: true,
    });
    return await modal.present();
  }
  async visualizarProdutosVisitados()
  {
   
    const itensVisitados = this.ProdutosVisitados
    const modal = await this.modalController.create({
      component: PedidoDetProdutosPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        itensVisitados
      },
      swipeToClose: true,
    });
    return await modal.present();
  }

  messageOptions(){
    this.mensagensService.forwardActive == false ? this.mensagensService.forwardActive = true : this.mensagensService.forwardActive = false;
  }

  forwardMessageSelect(event : any, mensagem:Mensagens){
     let isChecked = event.currentTarget.checked;

     let checkMensagem = this.forwardedMessages.reduce( function( cur, val, index ){

        if( val.uid === mensagem.uid && cur === -1 ) {
            
          return index;
        }
        return cur;
  
      }, -1 );



 

    if(checkMensagem >= 0)
    {
      //EXISTE
      console.log('Removendo mensagem ')
      this.forwardedMessages.splice(checkMensagem,1)
     
      
    }
    else
    {
      console.log('Adicionando mensagem')
      this.forwardedMessages.push(mensagem)
     
    }

   
    

    
  }
  
 

  cancelForward(){
    console.log('Encaminhar cancelado')
    this.checkboxencaminhar = false;
    //this.mensagensService.cancelForward();
    
    this.forwardedMessages = [];
  }

  closeForwardFooter(){
    this.mensagensService.forwardActive = false;
  
    this.modalEncaminhar();
  }


  async modalEncaminhar()
  {
  
    console.log(this.forwardedMessages)
    const modal = await this.modalController.create({
      component: EncaminharPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        mensagensParaEncaminhar:this.forwardedMessages
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        if(dados.data == 'enviado')
        {
          this.cancelForward();
   
        }
      }
    })

    await modal.present();
  }
  armazenarMensagemDigitada()
  {
    const msgdigitandao = {
      conversaUid:this.conversaUid,
      texto:this.chatMessageService.desktopMsg
    }
    console.log(JSON.stringify(msgdigitandao))

   
    let  cont = 0;
    let checkMsgTemporaria = this.srvGlobal.msgDigitando.reduce( function( cur, val, index ){

          if( val.conversaUid === msgdigitandao.conversaUid && cur === -1 ) {
              return index;
          }
          return cur;
      
      }, -1 );
      if(checkMsgTemporaria > -1)
      {
        this.srvGlobal.msgDigitando[checkMsgTemporaria].texto = msgdigitandao.texto
      }
      else
      {
        this.srvGlobal.msgDigitando.push(msgdigitandao)
      }


   

   
  

    
   
 

    

  }
  checkMsg(event : any) {
    
    

    


    const message = this.chatMessageService.desktopMsg.replace(/\s+/g, '');
    this.chatMessageService.cursorPosition = event.target.selectionStart;

    if(!this.plataform.is('hybrid'))
    {
      if (event.keyCode == 13 && !event.shiftKey) {
        if (message.length < 1 || this.chatMessageService.desktopMsg == null) {
          event.preventDefault();

          // this.buttonMessage = true;
          this.chatMessageService.desktopMsg = '';

        }
        else if(this.chatMessageService.desktopMsg != '' && this.chatMessageService.desktopMsg != null && this.chatMessageService.desktopMsg != ' ')
        {
          event.preventDefault();

          // this.cleanMsg = this.chatMessageService.desktopMsg;

          this.sendMsg();
        }
      }
      else if (event.keyCode == 13 && event.shiftKey) {
        if (message.length < 1 || this.chatMessageService.desktopMsg == null) {
          event.preventDefault();

          // this.buttonMessage = true;
          this.chatMessageService.desktopMsg = '';

        }
      }
      else if (event.keyCode == 32) {
        if (message.length < 1 || this.chatMessageService.desktopMsg == null) {
          event.preventDefault();

          // this.buttonMessage = true;
          this.chatMessageService.desktopMsg = '';

        }
      }
      else {
        if (this.chatMessageService.desktopMsg != '' && this.chatMessageService.desktopMsg != null) {
          this.buttonMessage = false;
        }
        else{
          this.buttonMessage = true;
        }
      }
    }
    else {
      if (event.keyCode == 13) {
        if (message.length < 1 || this.chatMessageService.desktopMsg == null) {
          event.preventDefault();
          // this.buttonMessage = true;
          this.chatMessageService.desktopMsg = '';
        }
        // else if(this.chatMessageService.desktopMsg != '' && this.chatMessageService.desktopMsg != null && this.chatMessageService.desktopMsg != ' ')
        // {
        //   event.preventDefault();
        //   this.sendMsg();
        // }
      }
    }
  }

  async sendMsg(){
    const message = this.chatMessageService.desktopMsg.replace(/\s+/g, '');

    if(message.length < 1)
    {
      this.chatMessageService.desktopMsg = '';
      // this.buttonMessage = true;
    }
    else
    {
      
        let naoRespondeuUid = '';
        let mensagemEnviar = this.chatMessageService.desktopMsg;
        this.chatMessageService.desktopMsg = '';
        // this.buttonMessage = true;

        if(this.dadosConversa.naoRespondeuUid)
        {
          naoRespondeuUid = this.dadosConversa.naoRespondeuUid;
        }
        this.dadosMensagem.mensagem = mensagemEnviar;
        this.dadosMensagem.naoRespondeuUid = naoRespondeuUid;
        this.dadosMensagem.canal = this.dadosConversa.canal;
        this.dadosMensagem.contatoOrigem = this.dadosConversa.contatoOrigem;
        this.dadosMensagem.contatoUid = this.dadosConversa.contatoUid;
        this.dadosMensagem.tipo = 'texto';
        
        
  
        if (mensagemEnviar != '' && mensagemEnviar != null) {
  
          
          await this.mensagensService.SendMesg(this.conversaUid,this.dadosMensagem)
          .then((res)=>{
            if(res)
            {
              
                //LIMPAR MENSAGEM DIGITADA ANTERIORMENTE this.srvGlobal.msgDigitando
            
                let conversaUidVerificar = this.conversaUid

                let checkMsgTemporaria = this.srvGlobal.msgDigitando.reduce( function( cur, val, index ){

                    if( val.conversaUid === conversaUidVerificar && cur === -1 ) {
                        return index;
                    }
                    return cur;
                
                }, -1 );
                if(checkMsgTemporaria > -1)
                {
                  this.srvGlobal.msgDigitando.splice(checkMsgTemporaria,1);
                }
            
            

            
             
              // this.buttonMessage = true;
            }
            else
            {
              alert('Mensagem deu erro ')
            }
            
          })
          .catch((err)=>{
            alert('Falha ao inserir mensagem '+err);
          })
    
          
    
        }
      
    }
    

  }
  verErro(msg:string)
  {
    alert(msg);
  }
  async MenuPopoverCreate(ev)
  {

    console.log('Abrindo popo ver ')

      const dadosEnviar2 = {
        conversaUid: this.conversaUid,
        ... this.dadosConversa
      }
    
      const popover = await this.popoverController.create({
        component: PopovermensagensComponent,
        event: ev,
        mode: 'ios',
        showBackdrop: false,
        cssClass:'custom-popover',
        componentProps: {
          dadosConversa2: dadosEnviar2,
          conversaUid: this.conversaUid,
          currentUser: this.currentUser,
          dadosConversa: this.dadosConversa,
          contatoUid: this.contatoUid,
          lembreteToDoUid:this.lembreteToDoUid
          

  
        }
      
      });
      popover.onDidDismiss().then((dados) => {
      
        if(dados !== undefined)
        {
          if(dados.data == 'alert')
          {
            this.presentModal(this.dadosConversa)
          }
        }
      })
      await popover.present();
  }
  async presentModal(dadosConversa:any) {
    console.log(dadosConversa)
     
    const modal = await this.modalController.create({
      component: PgTodoAddPage,
      showBackdrop:true,
      cssClass: 'selector-modal',
      componentProps: {
        dadosConversa
      }
      
    });
    return await modal.present();
  }
  async emojiPopoverCreate(ev)
  {

    console.log('Abrindo popo ver ')
    
    
      const popover = await this.popoverController.create({
        component: PopoveremojiPage,
        event: ev,
        mode: 'ios',
        showBackdrop: false,
        cssClass:'custom-popover',
        componentProps: {
          textarea: this.msgBoxCursor
        }
      });
      await popover.present();

  }

  async MenuPopoverMensagem(ev,listMensagem)
  {
    console.log(listMensagem);
    
    const popover2 = await this.popoverController.create({
      component: PopovermensagemopcaoPage,
      event: ev,
      mode: 'ios',
      showBackdrop: false,
      componentProps: {
        currentUser: this.currentUser,
        dadosMensagem: listMensagem
      },
    });
    popover2.onDidDismiss().then((dados) => {
      
      if(dados !== undefined)
      {
        if(dados.data == 'encaminhar')
        {
          console.log('encaminhar ativo')
          this.checkboxencaminhar = true;
        }
      }
    })
    await popover2.present();
  }
  
}
