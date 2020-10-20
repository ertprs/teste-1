import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ModalatfiltrosdataPage } from 'src/app/modals/atendimento/filtros/modalatfiltrosdata/modalatfiltrosdata.page';
import { ModalController } from '@ionic/angular';
import { ConsumopainelService } from 'src/app/services/controles/consumopainel.service';

@Component({
  selector: 'app-comp-consumos-home',
  templateUrl: './comp-consumos-home.component.html',
  styleUrls: ['./comp-consumos-home.component.scss'],
})
export class CompConsumosHomeComponent implements OnInit {

  private filtroSelect = {
    createAt: new Date().getTime(),
    dataIni:null,
    dataFim:null,
    dataIniString:null,
    dataFimString:null,
    situacao:'0',
    operador:null,
    operadorUid:false
  }

  private dadosConsumo = {
    creditosIaContratado:0,
    creditosIaConsumido:0,
    trafegoContratado:0,
    trafegoUtilizado:0
  }

  constructor(
    private eventEmitterService:ProvEmitterEventService,
    private ctrlModal:ModalController,
    private srvConsumo:ConsumopainelService
  ) { }

  ngOnInit() {
    this.srvConsumo.getPainel().subscribe(dados=>{
        this.dadosConsumo.creditosIaContratado    = dados["qtdContratada"]
        this.dadosConsumo.creditosIaConsumido     = dados["qtdConsumoIa"]
        this.dadosConsumo.trafegoContratado       = dados["trafegoContratado"]
        this.dadosConsumo.trafegoUtilizado        = dados["trafegoUtilizado"]
    })
  }

  functionExecute(functionName:string,params:any)
  {
    console.log('preparando '+functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  async abrirModalFiltroData()
  {
    const modal = await this.ctrlModal.create({
      component: ModalatfiltrosdataPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        origem:'homeatendimento'
      }
    });
    
    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        if(dados.data.acao == 'filtrar')
        {
          this.filtroSelect.dataIni = dados.data.filtro.dataIni
          this.filtroSelect.dataFim = dados.data.filtro.dataFim
          this.filtroSelect.dataIniString = dados.data.filtro.dataIniString
          this.filtroSelect.dataFimString = dados.data.filtro.dataFimString
        }
      }
    })
    await modal.present();
  }

}
