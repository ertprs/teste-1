
import { AngularFireAuth } from '@angular/fire/auth';
import { ConversasService } from './../../../services/chat/conversas.service';
import { Conversas } from 'src/app/interface/chat/conversas';
import { Component, OnInit, NgModule, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Subscription } from 'rxjs';
import { Mensagens } from 'src/app/interface/chat/mensagens';
import { IonContent, PopoverController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { AuthService } from './../../../services/seguranca/auth.service';

import { PopovermensagensComponent } from './../../../popover/popovermensagens/popovermensagens.component';
import { PopovermensagemopcaoPage } from 'src/app/popover/popovermensagemopcao/popovermensagemopcao.page';

//FILE TRANSFER
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ViewimagePage } from 'src/app/modals/chat/mensagem/viewimage/viewimage.page';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';


@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.page.html',
  styleUrls: ['./mensagens.page.scss'],
})


export class MensagensPage implements OnInit {

  private contatoUid: string = '';
  private contadorMsg: number = 0;

  private newMsg: string;
  private currentUser:any;
  private conversaUid:any;
  private dadosMensagem: Mensagens = {};
  private dadosConversa: Conversas = {};

  private buttonMessage : boolean = true;
  public  assumirAtendimento : boolean = true;

  private mensagens = new Array<Mensagens>();
  public forwardedMessages =  new Array();
  private forwardFilter : any[] = [];

  private itemsSubscription: Subscription;

  private forwardCheckbox : boolean = false;
  private hasMessageSelected : boolean = true;
  private allCheckboxes : boolean = false;

  private conversas = new Array<Conversas>();
  private conversaSubscription: Subscription;

  public ligarScroll2:Boolean = false;
  
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild('listMensagem', {  static: false })  myScrollContainer: ElementRef;
  
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
    private androidPermissions: AndroidPermissions,
    private routerOutlet: IonRouterOutlet
  ) { 

    //CHECAR PERMISSAO DE ESCRITA  
    
    this.currentUser = this.auth.getCUrrentUser();
    this.contatoUid = this.activeRoute.snapshot.params['contatoUid'];
    this.conversaUid = this.activeRoute.snapshot.queryParamMap.get('idconversa');

    this.assumirAtendimento = JSON.parse(this.activeRoute.snapshot.queryParamMap.get('assumirAtendimento')); 
    console.log('Assumindo valor de atendimento '+this.assumirAtendimento);

    this.loadMessages();  
    this.conversaSubscription = this.conversaService.get(this.conversaUid).subscribe(data=>{
          
      this.dadosConversa = data;

      this.forwardCheckbox = this.mensagensService.forwardActive;

      if(this.dadosConversa.usuarioUid == '')
      {
        if(this.assumirAtendimento)
        {
            //DEFINIR USUARIO PARA ESTA CONVERSA
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
        else
        {
          console.log('Usuario bisbliotando conversa');
        }
      
      }
      else
      {
        if(this.dadosConversa.usuarioUid == this.afa.auth.currentUser.uid)
        {
          //MARCAR COMO LIDO
        
          this.dadosConversa.qtdA = 0;
          this.conversaService.update(this.conversaUid,this.dadosConversa)
          .then(()=>{
            console.log('Conversa marcado como lido ');
          })
          .catch((err)=>{
            console.log('Falha ao marcar como lido');
          })
        }
        else
        {
          this.ligarScroll2 = true;
          console.log('Nao marcar como lido ');
          
        }
      }
      
    });
    
    
  }
  async loadMessages(){
    this.itemsSubscription = this.mensagensService.getMensagens(this.contatoUid).subscribe(data=>{
      let precisaDarScroll = false;
      data.forEach(elem=>{

        let chave = elem.uid;
        let encontrado = false;
        this.mensagens.forEach(elem2=>{

          if(chave.indexOf(elem2.uid)  >-1 )
          {
            //UPDATE INFORMACOES
            elem2.entregueTag = elem.entregueTag; 
            elem2.tipo        = elem.tipo;
            encontrado = true;
          }
          

        })

        if(encontrado)
        {
          //alert('existe | '+elem.mensagem)
          
        }
        else{
          this.mensagens.push(elem);
          precisaDarScroll = true;
          
          //alert('n existe | '+elem.mensagem)
        }
      })

      
      //alert(JSON.stringify( data));

    
      //COMENTARIO PARA REMOVER

      
      //marcar cmo lida 
      if(this.dadosConversa.usuarioUid == this.afa.auth.currentUser.uid)
      {
        this.dadosConversa.qtdA = 0;
        this.conversaService.update(this.conversaUid,this.dadosConversa)
        .then(()=>{
          console.log('Conversa marcado como lido ');
          
        })
        .catch((err)=>{
          console.warn('Falha ao marcar como lido');
        })
        .finally(()=>{
          if(precisaDarScroll)
          {
            //alert('Dar scroll');
            this.content.scrollToBottom(200);
          }
          
        })
      }
      else
      {
        if(precisaDarScroll)
        {
          //alert('Dar scroll');
          this.content.scrollToBottom(200);
        }
      }
    
    })

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
  checkPermissions(){
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.CAMERA,  
        this.androidPermissions.PERMISSION.GET_ACCOUNTS, 
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE
      ]
    );
  }

  ngOnInit() {
  }

  ngOnDestroy()
  {
    console.log('Subscribe destroy');
    this.itemsSubscription.unsubscribe();
    this.conversaSubscription.unsubscribe();
  }

  async Download(urlData:string)
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

  abrirImagem(url:string)
  {
    
  }

 

  ionViewDidEnter(){
    
    if(this.ligarScroll2)
    {
      //alert('Dar scroll');
      console.log('Scroll processado');
      this.content.scrollToBottom(200);
    }
    else
    {
      console.log('Nao deu scroll');
    }
  }

  messageOptions(){
    this.mensagensService.forwardActive == false ? this.mensagensService.forwardActive = true : this.mensagensService.forwardActive = false;
  }

  forwardMessageSelect(event : any, mensagemUid : number,  mensagem : string, autor : string,contatoUidOrigem:string){
    this.forwardFilter = [];

    let isChecked = event.currentTarget.checked;
    
    let forward = {
      mensagemUid: mensagemUid,
      mensagem: mensagem,
      autor: autor,
      conversaUid:this.conversaUid,
      contatoUidOrigem
    };

    if (isChecked) {
      let achou = false;
      
      this.forwardedMessages.forEach(item => {
        if (item.mensagemUid == mensagemUid) {
          achou = true;
        }
      });

      if (!achou) {
        this.forwardedMessages.push(forward);
      }

      this.forwardedMessages.length > 0 ? this.hasMessageSelected = false : this.hasMessageSelected = true;
    }
    else {
      let achou = false;
      
      this.forwardedMessages.forEach(item => {
        if (item.mensagemUid == mensagemUid) {
          achou = true;
        }
        else {
          this.forwardFilter.push(item);
        }
      });

      this.forwardedMessages = this.forwardFilter;

      this.forwardedMessages.length > 0 ? this.hasMessageSelected = false : this.hasMessageSelected = true;
    }

    this.mensagensService.messagesToFoward = this.forwardedMessages;
  }

  cancelForward(){
    this.mensagensService.cancelForward();
    this.forwardedMessages = [];
  }

  closeForwardFooter(){
    this.mensagensService.forwardActive = false;
    this.forwardedMessages = [];
  }

  checkMsg(event : any) {
    if (event.keyCode == 32) {
      if ((this.newMsg == '' && this.newMsg == null) || this.newMsg == ' ') {
        this.newMsg = '';
      }
    }
    else {
      this.newMsg != '' && this.newMsg != null ? this.buttonMessage = false : this.buttonMessage = true;
    }

  }

  async sendMsg(){

    if (this.buttonMessage == true) {
      this.design.presentToast(
        'Função desativada no momento',
        'warning',
        3000
      )
    }
    else {
      this.dadosMensagem.mensagem = this.newMsg;
      this.dadosMensagem.canal = this.dadosConversa.canal;
      this.dadosMensagem.contatoOrigem = this.dadosConversa.contatoOrigem;
      this.dadosMensagem.contatoUid = this.dadosConversa.contatoUid;
      this.dadosMensagem.tipo = 'texto';
  
      if (this.newMsg != '' && this.newMsg != null) {
  
        await this.mensagensService.SendMesg(this.conversaUid,this.dadosMensagem)
        .then((res)=>{
          if(res)
          {
            
            this.newMsg = '';
            this.buttonMessage = true;
  
          }
          else
          {
            alert('Mensagem deu erro ')
          }
          
        })
        .catch((err)=>{
          alert('Falha ao inserir mensagem ');
        })
  
        
  
      }
    }

  }

  async getPermission() {
    await this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    .then(status => {
        if (!status.hasPermission) {
          return this.androidPermissions.requestPermissions(
            [
              this.androidPermissions.PERMISSION.CAMERA,  
              this.androidPermissions.PERMISSION.GET_ACCOUNTS, 
              this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
              this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
              this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE
            ]
  
          );
      }
    });
  }
  
  async MenuPopoverCreate(ev)
  {

    console.log('Abrindo popo ver ')
    
    
      const popover = await this.popoverController.create({
        component: PopovermensagensComponent,
        event: ev,
        mode: 'ios',
        showBackdrop: false,
        componentProps: {
          conversaUid: this.conversaUid,
          currentUser: this.currentUser,
          dadosConversa: this.dadosConversa,
          contatoUid: this.contatoUid,
        },
        cssClass:'custom-popover'
      });
      await popover.present();
  }

  async MenuPopoverMensagem(ev,listMensagem)
  {
    const popover2 = await this.popoverController.create({
      component: PopovermensagemopcaoPage,
      event: ev,
      mode: 'ios',
      showBackdrop: false,
      componentProps: {
        currentUser: this.currentUser,
        dadosMensagem: listMensagem,
      },
    });
    await popover2.present();
  }
}
