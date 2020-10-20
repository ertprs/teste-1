import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ListatransmissaoService } from 'src/app/services/chat/listatransmissao.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Contatos } from 'src/app/interface/chat/contatos';
import { ListaTransmissao, ListaTransmissaoDisparos } from 'src/app/interface/chat/lista-transmissao';
import { ModalController, Platform } from '@ionic/angular';
import { UploadstorageService } from 'src/app/services/global/uploadstorage.service';
import { AnexosPage } from 'src/app/modals/chat/anexos/anexos.page';

@Component({
  selector: 'app-comp-chat-contatos-listatransmissao-add',
  templateUrl: './comp-chat-contatos-listatransmissao-add.component.html',
  styleUrls: ['./comp-chat-contatos-listatransmissao-add.component.scss'],
})
export class CompChatContatosListatransmissaoAddComponent implements OnInit {

  @Input() data: any;

  private dadosContatoLista: Contatos;
  private dadosLista: ListaTransmissao = {};

  private listaUid:string = '';
  private queryText:string;

  private relatorioSubscription : Subscription;

  public plataforma:String = 'web';

  constructor(
    private platform:Platform,
    private eventEmitterService: ProvEmitterEventService,
    private listatransmissaoService : ListatransmissaoService,
    private design : ProcessosService,
    public serviceUpload:UploadstorageService,
    private modalController: ModalController,
  ) { 
    this.relatorioSubscription = new Subscription;
  }

  ngOnInit() {
    this.dadosContatoLista = this.data;
    this.dadosLista.disparoImediato = true;
    this.dadosLista.contatoListaUid = this.dadosContatoLista.id;
    this.dadosLista.nome = '';
    this.dadosLista.mensagem = '';
    this.dadosLista.anexo = '';
    this.dadosLista.acao = '';
    this.dadosLista.libWpp = false;
    this.dadosLista.libSms = false;
    this.dadosLista.libEmail = false;
    this.dadosLista.situacao = 3;
    this.dadosLista.subgrupo = this.dadosContatoLista.subgrupo;
    this.dadosLista.grupo = this.dadosContatoLista.grupo;
    this.dadosLista.cidade = this.dadosContatoLista.cidade;
    this.dadosLista.estado = this.dadosContatoLista.estado;
    this.dadosLista.canalFiltro = this.dadosContatoLista.canalFiltro;

    if(this.platform.is('hybrid'))
    {
      console.log('Setando como hybrido')
      this.plataforma = 'hybrid'
    }

  }

  ngOnDestroy() {
    this.relatorioSubscription.unsubscribe();
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  confirmTransmissao() {
    this.design.presentAlertConfirm(`Iniciar transmissão`,`Deseja mesmo transmitir essa lista?`,'Opa!','Não!').then(result => {
      if(result) {
        this.transmissaoIncluir();
      } else {
        console.log('NÃO Transmitir');
      }
    });
  }

  transmissaoIncluir() {
    console.log(this.dadosLista);
    this.design.presentLoading('Iniciando transmissão...').then(resLoading=>{
      resLoading.present();
      
      this.listatransmissaoService.add(this.dadosLista).then(res=>{

        this.listaUid = res.id;

        this.design.presentToast(
          'Lista iniciada com sucesso',
          'success',
          3000
        );
        this.functionExecute('ListatransmissaoPerformanceComponent',this.dadosContatoLista);
      }).catch(err=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao iniciar lista de transmissão',
          'danger',
          4000
        );
      }).finally(() => {
        resLoading.dismiss();
      }) 
    });
  }

  checkBoxLib(ev,campo) {
    let isChecked = ev.currentTarget.checked;

    console.log(isChecked);
    
    if(!isChecked)
    {
      this.dadosLista[campo] = false;
    }
    else
    {
      this.dadosLista[campo] = true;
    }
  }

  async upload()
  {
    await this.serviceUpload.SelecionarArquivo('').then((downloadUrl)=>{
      this.dadosLista.anexo = downloadUrl;
    }).catch((err)=>{
      alert(err)
    }) 
  }

  async uploadDesk(){
    const modal = await this.modalController.create({
      component: AnexosPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(), // Get the top-most ion-modal
      componentProps: {
        origemChamada: 'listatransmissao'
      }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        if(data.data.link !== undefined) {
          this.dadosLista.anexo = data.data.link;
        }
      }
    });

    await modal.present();
  }


}
