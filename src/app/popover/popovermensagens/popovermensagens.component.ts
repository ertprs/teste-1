import { AnexosPage } from './../../modals/chat/anexos/anexos.page';
import { Router } from '@angular/router';
import { UploadstorageService } from './../../services/global/uploadstorage.service';
import { async } from '@angular/core/testing';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, NavParams, AlertController, PopoverController, ModalController, Platform } from '@ionic/angular';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { MensagensService } from 'src/app/services/chat/mensagens.service';

import { EncerrarPage } from 'src/app/modals/chat/mensagem/encerrar/encerrar.page';

import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

//CAPACITOR CAMERA
import { Plugins,CameraResultType,CameraSource,FilesystemDirectory, FilesystemEncoding } from '@capacitor/core'
import { SafeResourceUrl } from '@angular/platform-browser';

import { DomSanitizer } from '@angular/platform-browser'
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Mensagens } from 'src/app/interface/chat/mensagens';
import { Conversas } from 'src/app/interface/chat/conversas';

import { TransferenciaPage } from 'src/app/modals/chat/transferencia/transferencia.page';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { UserService } from 'src/app/services/global/user.service';
import { PgTodoAddPage } from 'src/app/pages/todo/add/pg-todo-add/pg-todo-add.page';
import { RespostaautomaticaPage } from 'src/app/modals/chat/mensagem/respostaautomatica/respostaautomatica.page';
import { ModalchatconvhistoricobackupPage } from 'src/app/modals/chat/conversas/historico/modalchatconvhistoricobackup/modalchatconvhistoricobackup.page';

@Component({
  selector: 'app-popovermensagens',
  templateUrl: './popovermensagens.component.html',
  styleUrls: ['./popovermensagens.component.scss'],
})
export class PopovermensagensComponent implements OnInit {


  @Input() dadosConversa2: any;

  
  private uploadPercent: Observable<number>;
  private downloadUrl: Observable<string>;

  private conversaUid:any;
  private currentUser:any;
  private contatoUid: string;
  private dadosMensagem: Mensagens = {};

  private dadosConversa: Conversas = {};

  private pathConverter:string = ''
  private  fileUri:string = ''
  private filePath:string = ''
  private fileName:string = ''
  private fileType:string = ''
  private lembreteToDoUid:string;
  private entry:any;
  public plataforma:String = 'web';

  private image:SafeResourceUrl;
  files = [];
  uploadProgress = 0;

  public uploadpercent:Observable<number>;
  public downloadUrlSet:Observable<string>;
  private mensagens = new Array<Mensagens>();

  public  exibiralerta:boolean=false;

  

  constructor(
    private platform:Platform,
    private nav:NavParams,
    public serviceUpload:UploadstorageService,
    private popoverController: PopoverController,
    private design:ProcessosService,
    private modalController: ModalController,
    private afStorage:AngularFireStorage,
    private mensagensService:MensagensService,
    private transfer: FileTransfer, 
    private file: File,
    private FilePath:FilePath,
    private fileChooser:FileChooser,
    private storage:AngularFireStorage,
    private domsanitizer:DomSanitizer,
    private androidPermissions: AndroidPermissions,
    private router:Router,
    private eventEmitterService: ProvEmitterEventService,
    private srvGlobal:UserService
    
  ) { 
    this.conversaUid = this.nav.get('conversaUid');
    this.currentUser = this.nav.get('currentUser');
    this.contatoUid = this.nav.get('contatoUid');
    this.dadosConversa = this.nav.get('dadosConversa');
    this.lembreteToDoUid = this.nav.get('lembreteToDoUid')
    if(this.lembreteToDoUid === undefined)
    {
      this.exibiralerta = true;
    }
    else{
      this.exibiralerta = false;
    }
  

    console.log('Verificando dados de conversa');
    console.log(this.dadosConversa);

   
  }
  async getPermission() {
    await this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (!status.hasPermission) {
          return this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
  
          );
      }
      });
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
  lembrete()
  {
    this.popoverController.dismiss('alert')
  }

  abrirOrcamento()
  {
    if(this.dadosConversa.uidClienteVinculado && this.dadosConversa.uidClienteVinculado != '')
    {
      this.functionExecute('CompPedidoAdd',{conversaUid:this.conversaUid,dadosConversa:this.dadosConversa})
    }
    else
    {
      this.design.presentToast(
        'Antes de gerar um orçamento você precisa vincular este contato a um parceiro de negócios.',
        'secondary',
        0,
        true
      )
    }
  }

  async abrirBackup()
  { 
    
    alert('Está função é para usuários que utilizavam a versão anterior da Plataforma Lara')
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: ModalchatconvhistoricobackupPage,
      mode: 'ios',
    
      showBackdrop: true,
      
      cssClass: 'selector-modal',
      componentProps: {
        currentUser: this.currentUser,
        dadosMensagem: this.dadosMensagem,
        dadosConversa:this.dadosConversa2
      }
    });
    await modal.present();
  }

  async AbrirBaseConhecimento()
  { 
    
   
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: RespostaautomaticaPage,
      mode: 'ios',
    
      showBackdrop: true,
      
      cssClass: 'selector-modal',
      componentProps: {
        currentUser: this.currentUser,
        dadosMensagem: this.dadosMensagem,
        dadosConversa:this.dadosConversa2
      }
    });
    await modal.present();
  }
  abrirTicket()
  {
    this.functionExecute('compticketadd',{dadosConversa:this.dadosConversa})
  }
  functionExecute(functionName:string,params:any)
  {
    this.popoverController.dismiss();
  

    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  ngOnInit() {
  
    

    if(this.platform.is('hybrid'))
    {
      console.log('Setando como hybrido')
      this.plataforma = 'hybrid'
    }
  }



  criarOrcamento()
  {
    this.popoverController.dismiss();
    this.dadosConversa
    let url = {
      queryParams:{
        conversaUid:this.conversaUid,
        contatoUid:encodeURI( this.dadosConversa.contatoUid),
        contatoNome:encodeURI(this.dadosConversa.contatoNome),
        clienteUid:encodeURI('uidDoCliente'),
        clienteNome:encodeURI(this.dadosConversa.nomeClienteVinculado),
        canal:encodeURI(this.dadosConversa.canal),
        contadoOrigem:encodeURI(this.dadosConversa.contatoOrigem)

      }
    }
    console.log('Preparando tela comercial ')
    console.log(url);
    if(this.dadosConversa.comercialUidOrcamento && this.dadosConversa.comercialUidOrcamento != '')
    {
      this.router.navigate(['/comercial/add/'+this.dadosConversa.comercialUidOrcamento], url)
    }
    else
    {
      this.router.navigate(['/comercial/add'], url);
    }
    
  }
 

  async takePhoto(){

    const { Camera }  = Plugins
    const result =await  Camera.getPhoto({
       quality:75,
       allowEditing:false,
       source: CameraSource.Camera,
       resultType: CameraResultType.Base64
    })

  
   // this.image = this.domsanitizer.bypassSecurityTrustResourceUrl( result && result.base64String)

    const blob: Blob = new Blob([result.base64String],{ type: 'image/jpeg'})
    console.log('Buffer pronto ');
    const randomId = Math.random().toString(36).substring(2);
    const nomeArquivo = new Date().getTime()+randomId+'.jpg';

    //this.uploadData(blob,nomeArquivo);


    console.log(this.image);
  }
  popoverDismiss(){
    this.popoverController.dismiss();
  }
  async upload()
  {
    this.popoverController.dismiss();
   await this.serviceUpload.SelecionarArquivo()
   .then((downloadUrl)=>{

    
    this.dadosMensagem.mensagem = '';
    this.dadosMensagem.canal = this.dadosConversa.canal;
    this.dadosMensagem.contatoOrigem = this.dadosConversa.contatoOrigem;
    this.dadosMensagem.contatoUid = this.dadosConversa.contatoUid;
    this.dadosMensagem.tipo = 'anexo';
    this.dadosMensagem.anexo = downloadUrl;

    this.mensagensService.SendMesg(this.conversaUid,this.dadosMensagem).then(()=>{
      console.log('Anexo enviado com sucesso ');
      
    })
    .catch((err)=>{
      console.log(err);
    })


    
   })
   .catch((err)=>{
     alert(err)
   })

    
    
    
  }


  

  async chatEncerrar() {
    this.popoverController.dismiss();
    this.design.presentAlertConfirm(`Encerrar atendimento`,`Deseja mesmo encerrar este atendimento?`,'Opa!','Não!').then(result => {
      if(result) {
        this.modalCreate();
      } else {
        console.log('NÃO ENCERRAR');
      }
    });
  }

  async modalCreate()
  {
    const modal = await this.modalController.create({
      component: EncerrarPage,
      mode: 'ios',
      showBackdrop: true,
      
      cssClass: 'selector-modal',
      componentProps: {
        conversaUid: this.conversaUid,
        contatoUid: this.contatoUid,
        currentUser: this.currentUser,
        dadosConversa: this.dadosConversa
      }
    });
    await modal.present();
  }

  async modalTransferencia() {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: TransferenciaPage,
      mode: 'ios',
      showBackdrop: true,
      
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(), // Get the top-most ion-modal
      componentProps: {
        currentUser: this.currentUser,
        conversaUid: this.conversaUid,
        contatoUid:this.contatoUid,
        origemChamada: 'mensagens'
      }
    });
    await modal.present();
  }

  async uploadDesk(){
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: AnexosPage,
      mode: 'ios',
      showBackdrop: true,
      
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(), // Get the top-most ion-modal
      componentProps: {
        currentUser: this.currentUser,
        conversaUid: this.conversaUid,
        contatoUid:this.contatoUid,
        dadosConversa:this.dadosConversa,
        origemChamada: 'mensagens'
      }
    });
    await modal.present();
  }


}
