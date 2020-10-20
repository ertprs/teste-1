import { AnexosPage } from './../../modals/chat/anexos/anexos.page';
import { Router } from '@angular/router';
import { UploadstorageService } from './../../services/global/uploadstorage.service';
import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, ModalController, Platform } from '@ionic/angular';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { EncerrarPage } from 'src/app/modals/chat/mensagem/encerrar/encerrar.page';
import { Observable } from 'rxjs';

//CAPACITOR CAMERA
import { Plugins,CameraResultType,CameraSource } from '@capacitor/core'
import { SafeResourceUrl } from '@angular/platform-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Mensagens } from 'src/app/interface/chat/mensagens';
import { Conversas } from 'src/app/interface/chat/conversas';
import { TransferenciaPage } from 'src/app/modals/chat/transferencia/transferencia.page';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { PgTodoAddPage } from 'src/app/pages/todo/add/pg-todo-add/pg-todo-add.page';
import { AuthService } from 'src/app/services/seguranca/auth.service';

@Component({
  selector: 'app-popovermensagens',
  templateUrl: './popovermensagens.component.html',
  styleUrls: ['./popovermensagens.component.scss'],
})
export class PopovermensagensComponent implements OnInit {

  private conversaUid:any;
  private currentUser:any;
  private idCliente:string;
  private contatoUid: string;
  private dadosMensagem: Mensagens = {};
  private dadosConversa: Conversas = {};
  private lembreteToDoUid:string;
  public plataforma:String = 'web';
  private image:SafeResourceUrl;
  public uploadpercent:Observable<number>;
  public downloadUrlSet:Observable<string>;
  public exibiralerta:boolean = false;

  constructor(
    private platform:Platform,
    private nav:NavParams,
    public serviceUpload:UploadstorageService,
    private popoverController: PopoverController,
    private design:ProcessosService,
    private modalController: ModalController,
    private mensagensService:MensagensService,
    private androidPermissions: AndroidPermissions,
    private router:Router,
    private eventEmitterService: ProvEmitterEventService,
    private auth : AuthService
  ) 
  { 
    console.log(this.platform.platforms);
    this.conversaUid = this.nav.get('conversaUid');
    this.currentUser = this.nav.get('currentUser');
    this.contatoUid = this.nav.get('contatoUid');
    this.dadosConversa = this.nav.get('dadosConversa');
    this.lembreteToDoUid = this.nav.get('lembreteToDoUid');

    console.log('Verificando dados de conversa');
    console.log(this.dadosConversa);

    this.lembreteToDoUid === undefined ? this.exibiralerta = true : this.exibiralerta = false;
  }
  
  async getPermission() {
    await this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    .then(status => {
      if (!status.hasPermission) 
      return this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
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
    this.popoverController.dismiss('alert');
  }

  abrirOrcamento()
  {
    if(this.dadosConversa.uidClienteVinculado && this.dadosConversa.uidClienteVinculado != '')
    {
      this.functionExecute('CompPedidoAdd',{conversaUid:this.conversaUid,dadosConversa:this.dadosConversa});
    }
    else
    {
      this.design.presentToast(
        'Antes de gerar um orçamento você precisa vincular este contato a um parceiro de negócios.',
        'secondary',
        0,
        true
      );
    }
  }
  
  abrirTicket()
  {
    this.functionExecute('compticketadd',{ dadosConversa: this.dadosConversa });
  }

  functionExecute(functionName:string,params:any)
  {
    this.popoverController.dismiss();
  
    const param = {
      function: functionName,
      data: params
    };

    console.log('Active Click');
    console.log(param);
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  
  ngOnInit() {
    if(this.platform.is('hybrid')) this.plataforma = 'hybrid';

      this.currentUser = this.auth.getCUrrentUser();
      this.idCliente = this.currentUser['idCliente'];
      console.warn(`ID Cliente: ${this.idCliente}`);
  }

  criarOrcamento()
  {
    this.popoverController.dismiss();
    this.dadosConversa;

    let url = {
      queryParams: {
        conversaUid: this.conversaUid,
        contatoUid: encodeURI(this.dadosConversa.contatoUid),
        contatoNome: encodeURI(this.dadosConversa.contatoNome),
        clienteUid: encodeURI('uidDoCliente'),
        clienteNome: encodeURI(this.dadosConversa.nomeClienteVinculado),
        canal: encodeURI(this.dadosConversa.canal),
        contadoOrigem: encodeURI(this.dadosConversa.contatoOrigem)
      }
    };

    console.log('Preparando tela comercial');
    console.log(url);

    this.dadosConversa.comercialUidOrcamento && this.dadosConversa.comercialUidOrcamento != '' 
    ? this.router.navigate(['/comercial/add/'+this.dadosConversa.comercialUidOrcamento], url)
    : this.router.navigate(['/comercial/add'], url);
  }

  async takePhoto() {

    const { Camera }  = Plugins;
    const result =await  Camera.getPhoto({
      quality: 75,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.Base64
    });

   // this.image = this.domsanitizer.bypassSecurityTrustResourceUrl( result && result.base64String)

    const blob : Blob = new Blob([result.base64String],{ type: 'image/jpeg'});
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
    await this.serviceUpload.SelecionarArquivo(this.idCliente)
    .then(downloadUrl => {
      this.dadosMensagem.mensagem = '';
      this.dadosMensagem.canal = this.dadosConversa.canal;
      this.dadosMensagem.contatoOrigem = this.dadosConversa.contatoOrigem;
      this.dadosMensagem.contatoUid = this.dadosConversa.contatoUid;
      this.dadosMensagem.tipo = 'anexo';
      this.dadosMensagem.anexo = downloadUrl;
      
      this.mensagensService.SendMesg(this.conversaUid,this.dadosMensagem)
      .then(() => console.log('Anexo enviado com sucesso '))
      .catch(err => console.log(err));
    })
    .catch(err => alert(err));
  }

  async chatEncerrar() {
    this.popoverController.dismiss();
    this.design.presentAlertConfirm(`Encerrar atendimento`,`Deseja mesmo encerrar este atendimento?`,'Opa!','Não!').then(result => {
      result ? this.modalCreate() : console.log('NÃO ENCERRAR');
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