import { ProcessosService } from 'src/app/services/design/processos.service';
import { LancamentoService } from 'src/app/services/financeiro/lancamento.service';
import { Component, OnInit } from '@angular/core';
import { Itlancamento } from 'src/app/interface/financeiro/lancamento';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { PopoverfinitemlistPage } from 'src/app/popover/financeiro/popoverfinitemlist/popoverfinitemlist.page';
import { ModalController, PopoverController } from '@ionic/angular';
import { ModalfinapoioselecionartipoPage } from 'src/app/modals/financeiro/apoio/modalfinapoioselecionartipo/modalfinapoioselecionartipo.page';
import { ModalfincategoriaaddPage } from 'src/app/modals/financeiro/categorias/add/modalfincategoriaadd/modalfincategoriaadd.page';
import { ModalapoioemailsendPage } from 'src/app/modals/apoio/email/send/modalapoioemailsend/modalapoioemailsend.page';
import { ModalatfiltrosdataPage } from 'src/app/modals/atendimento/filtros/modalatfiltrosdata/modalatfiltrosdata.page';
import { ModalapoiowhatsappsendPage } from 'src/app/modals/apoio/whatsapp/send/modalapoiowhatsappsend/modalapoiowhatsappsend.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class FinanceiroHomeComponent implements OnInit {


  public registrosLancamentos = []
  private dashRecebimentos:number
  private dashPagamentos:number
  private filtroSelect = {
    tipo:'todos',
   
    dataIni:null,
    dataFim:null,
    dataIniString:null,
    dataFimString:null,
    buscarpor:''
  }
  constructor(
    private srvLancamentos:LancamentoService,
    private eventEmitterService: ProvEmitterEventService,
    private design:ProcessosService,
    private ctrlPopover:PopoverController,
    private ctrlModal:ModalController
  ) {
  
  }

  ngOnInit() {

    this.calculosDash()
    this.srvLancamentos.getAll().subscribe(elementRetorno=>{
      this.registrosLancamentos = elementRetorno
      //elementRetorno.forEach(dados => {
        //let checkRegistro = this.registrosLancamentos.reduce( function( cur, val, index ){
        //  this.registrosLancamentos.push(dados)
          //if( val.id === dados.id && cur === -1 ) {
          //    
          //  return index;
         // }
         // return cur;
    
        //}, -1 );
  
        //if(checkRegistro > -1)
        //{
          //existe
        //  this.registrosLancamentos[checkRegistro] = dados
        //}
        //else
        //{
         //NAO EXISTE adicionar
        //  this.registrosLancamentos.push(dados)
        //}
     // });

      



    })
  }

  ngOnDestroy() {

  }
  async gerarFiltro(){
    console.log(this.filtroSelect)
    let sql = "WHERE parceiroNome like '%"+this.filtroSelect.buscarpor+"%'  "
    this.srvLancamentos.gerarFiltro(sql).subscribe(dadosRet=>{
      console.log(dadosRet)
      if(dadosRet.situacao == 'suc')
      {
        this.registrosLancamentos = []
        dadosRet.data.data[0].forEach(dados => {
          if(dados.lancamentoUid != null)
          {
            console.warn('ABRIR '+dados.lancamentoUid)
            this.srvLancamentos.getLancamento(dados.lancamentoUid).subscribe(dadosRet=>{
              if(dadosRet.exists)
              {
                const id = dadosRet.id
                const data = dadosRet.data()
                const dadosAdd = {
                  id,
                  ... data
                }
                this.registrosLancamentos.push(dadosAdd)
              }
            })
          }
        });
        
        
      }
    })
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
        origem:'homefinanceiro'
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
  async calculosDash(){
    //CREDITOS
    this.srvLancamentos.lancamentoDash('credito')
    .then(resDash=>{
     
      this.dashRecebimentos = resDash.total
    })
    .catch(err=>{
      this.dashRecebimentos = 0
      console.log(err)
    })

    //DEBITOS
    this.srvLancamentos.lancamentoDash('debito')
    .then(resDash=>{
      console.log('AQUI '+resDash.total)
      this.dashPagamentos = 0+resDash.total
    })
    .catch(err=>{
      this.dashPagamentos = 0
      console.log(err)
    })
  }
  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  async categoriaAdd()
  {
    const modal = await this.ctrlModal.create({
      component: ModalfincategoriaaddPage,
      cssClass: 'selector-modal',
      
      
    });
    return await modal.present();
  }

  async enviarPorEmail(dados:any)
  {
    const modal = await this.ctrlModal.create({
      component: ModalapoioemailsendPage,
      cssClass: 'selector-modal',
      componentProps: {
        dadosFinanceiro:dados
      }
      
    });
    return await modal.present();
  }


  async enviarPorWPP(dados:any)
  {
    const modal = await this.ctrlModal.create({
      component: ModalapoiowhatsappsendPage,
      cssClass: 'selector-modal',
      componentProps: {
        dadosFinanceiro:dados
      }
      
    });
    return await modal.present();
  }

  async selecionarTipoNovo(tipo:string) {
    const modal = await this.ctrlModal.create({
      component: ModalfinapoioselecionartipoPage,
      cssClass: 'selector-modal',
      
    });
    modal.onDidDismiss().then((dados) => {

      console.log(dados)
      if(dados.data !== undefined)
      {
        const dataReturn = dados.data
        if(dataReturn.acao === 'compfinview')
        {
          this.functionExecute(dados.data.acao,{})
        }
        else if(dataReturn.acao === 'modalfincategoriaadd')
        {
          this.categoriaAdd()
        }
        else if(dataReturn.acao === "compfinrecorrenciahome"){
          this.functionExecute(dados.data.acao,{})
        }
        else{

        }
       
        //novoLancamento
      }


    })
    return await modal.present();
  }
  novoLancamento(){
    this.functionExecute('compfinview',{})
  }
  boletoDownload(url)
  {
    window.open(url, '_blank');
 
  }
  async lancamentoCancelar(uid:string)
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma cancelar este recebimento?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Cancelando...')
        .then(resLoading=>{
          resLoading.present()
          this.srvLancamentos.lancamentoCancelar(uid)
          .then(res=>{
            this.design.presentToast(
              'Cancelado com sucesso',
              'success',
              3000

            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao cancelar lançamento',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoading.dismiss()
          })
        })
      }
    })
  }
  async reprocessarBoleto(dados:any)
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Você quer reprocessar esta requisição de  boleto?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Aguarde...')
        .then(resLoading=>{
          resLoading.present()
          this.srvLancamentos.lancamentoReprocessar(dados.id)
          .then(resUpdate=>{
            this.design.presentToast(
              "Sua solicitação de reprocessamento foi aceita com sucesso. Aguarde até que seu boleto seja processado",
              "secondary",
              5000
            )
          })
          .catch(errUpdate=>{
            console.log(errUpdate)
            this.design.presentToast(
              "Falha ao tentar reprocessar",
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoading.dismiss()
          })


        })
      }
    })
  }
  async popoverItem(ev:any,item:any)
  {
    console.log(item)
    const popover = await this.ctrlPopover.create({
      component:PopoverfinitemlistPage,
      event: ev,
      translucent: true,
      componentProps: {
        item
      }
    });

    popover.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados.data){
        const dataRetorno = dados.data
        if(dataRetorno.acaoCod === "2")
        {
          this.boletoDownload(item.dadosBoleto.url)
        }
        if(dataRetorno.acaoCod === "4")
        {
          this.enviarPorEmail(item)
          
        }

        if(dataRetorno.acaoCod === "5")
        {
          this.reprocessarBoleto(item)
        }
        if(dataRetorno.acaoCod === "6")
        {
          this.enviarPorWPP(item)
          
        }
      }

    })
    await popover.present();

  }



}
