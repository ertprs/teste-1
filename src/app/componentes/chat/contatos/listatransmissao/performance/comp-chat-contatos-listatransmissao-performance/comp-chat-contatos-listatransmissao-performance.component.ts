import { ModalTransmissaoDetalhePage } from './../../../../../../modals/lista-transmissao/detalhe/modal-transmissao-detalhe/modal-transmissao-detalhe.page';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ListatransmissaoService } from 'src/app/services/chat/listatransmissao.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Contatos } from 'src/app/interface/chat/contatos';
import { ListaTransmissao, ListaTransmissaoDisparos } from 'src/app/interface/chat/lista-transmissao';

@Component({
  selector: 'app-comp-chat-contatos-listatransmissao-performance',
  templateUrl: './comp-chat-contatos-listatransmissao-performance.component.html',
  styleUrls: ['./comp-chat-contatos-listatransmissao-performance.component.scss'],
})
export class CompChatContatosListatransmissaoPerformanceComponent implements OnInit {

  @Input() data: any;

  private dadosContatoLista: Contatos;

  private dadosListas = new Array<ListaTransmissao>();
  private dadosListasFilter = new Array<ListaTransmissao>();

  private dadosAlcances = new Array();

  private listasSubscription: Subscription;

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private listatransmissaoService : ListatransmissaoService,
    private design : ProcessosService,
    private ctrlModal:ModalController
  ) { 
    this.listasSubscription = new Subscription;
  }

  ngOnDestroy() {
    this.listasSubscription.unsubscribe();
  }
  
  ngOnInit() {
    this.dadosContatoLista = this.data;

    this.loadDados();
    
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  loadDados() {
    this.design.presentLoading('Carregando dados...').then(resLoading=>{
      resLoading.present();
      this.listasSubscription = this.listatransmissaoService.getAllListas(this.dadosContatoLista.id).subscribe(data => {

        data = data.sort(function(a,b){return b.createAt-a.createAt});

        this.dadosListas = data;

        this.dadosAlcances = new Array();
        
        let totalWpp = 0;
        let totalSms = 0;
        let totalEmail = 0;
        let totalEntregueWpp = 0;
        let totalEntregueSms = 0;
        let totalEntregueEmail = 0;
        let totalAguardandoWpp = 0;
        let totalAguardandoSms = 0;
        let totalAguardandoEmail = 0;
        let totalVisualizadasWpp = 0;
        let totalVisualizadasSms = 0;
        let totalVisualizadasEmail = 0;
        let totalErrosWpp = 0;
        let totalErrosSms = 0;
        let totalErrosEmail = 0;
        data.forEach(item => {
          if(item.wppTotal !== undefined) totalWpp += item.wppTotal;
          if(item.smsTotal !== undefined) totalSms += item.smsTotal;
          if(item.emailTotal !== undefined) totalEmail += item.emailTotal;
          if(item.wppAguardando !== undefined) totalAguardandoWpp += item.wppAguardando;
          if(item.smsAguardando !== undefined) totalAguardandoSms += item.smsAguardando;
          if(item.emailAguardando !== undefined) totalAguardandoEmail += item.emailAguardando;
          if(item.wppEnviado !== undefined) totalEntregueWpp += item.wppEnviado;
          if(item.smsEnviado !== undefined) totalEntregueSms += item.smsEnviado;
          if(item.emailEnviado !== undefined) totalEntregueEmail += item.emailEnviado;
          if(item.wppVisualizado !== undefined) totalVisualizadasWpp += item.wppVisualizado;
          if(item.smsVisualizado !== undefined) totalVisualizadasSms += item.smsVisualizado;
          if(item.emailVisualizado !== undefined) totalVisualizadasEmail += item.emailVisualizado;
          if(item.wppErro !== undefined) totalErrosWpp += item.wppErro;
          if(item.smsErro !== undefined) totalErrosSms += item.smsErro;
          if(item.emailErro !== undefined) totalErrosEmail += item.emailErro;
        });

        if(totalWpp > 0) {
          this.dadosAlcances.push({
            titulo: `Whatsapp`,
            total: totalWpp,
            aguardando: totalAguardandoWpp,
            entregues: totalEntregueWpp,
            visualizadas: totalVisualizadasWpp,
            erros: totalErrosWpp,
          });
        }

        if(totalSms > 0) {
          this.dadosAlcances.push({
            titulo: `SMS`,
            total: totalSms,
            aguardando: totalAguardandoSms,
            entregues: totalEntregueSms,
            visualizadas: totalVisualizadasSms,
            erros: totalErrosSms,
          });
        }

        if(totalEmail > 0) {
          this.dadosAlcances.push({
            titulo: `E-mail`,
            total: totalEmail,
            aguardando: totalAguardandoEmail,
            entregues: totalEntregueEmail,
            visualizadas: totalVisualizadasEmail,
            erros: totalErrosEmail,
          });
        }
        resLoading.dismiss();
      })
    });
  }
  listaAbortar(id:string)
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Está ação irá cancelar os envios ',
      'QUERO CANCELAR',
      'CONTINUAR'
    )
    .then(res=>{
      if(res)
      {
        this.listaAbortarProcesso(id);
      }
    })
  }
  listaAbortarProcesso(id:string) {

    console.log(id);
    this.design.presentLoading('Carregando dados...').then(resLoading=>{
      resLoading.present();
      const dados:ListaTransmissao = { situacao: 4 };
      this.listatransmissaoService.update(id,dados).then(res=>{
        this.design.presentToast(
          'Transmissão abortada com sucesso',
          'success',
          3000
        );
      }).catch(err=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao abortar transmissão',
          'danger',
          4000
        );
      }).finally(() => {
        resLoading.dismiss();
      }) 
    });
  }

  listaRetransmitir(id:string) {
    console.log(id);
    this.design.presentLoading('Carregando dados...').then(resLoading=>{
      resLoading.present();
      const dados:ListaTransmissao = { situacao: 3 };
      this.listatransmissaoService.update(id,dados).then(res=>{
        this.design.presentToast(
          'Transmissão iniciada com sucesso',
          'success',
          3000
        );
      }).catch(err=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao iniciar transmissão',
          'danger',
          4000
        );
      }).finally(() => {
        resLoading.dismiss();
      }) 
    });
  }
  
  async abrirEstatisticas(id:string)
  {
    const modal = await this.ctrlModal.create({
      component: ModalTransmissaoDetalhePage,
      cssClass: 'selector-modal',
      componentProps: {
        'listaUid': id
      }
    });
    return await modal.present();
  }


}
