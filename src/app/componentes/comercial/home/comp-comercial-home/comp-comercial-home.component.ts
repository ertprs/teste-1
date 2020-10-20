import { ModalComercialDashDetNegociandoPage } from './../../../../modals/dash/modal-comercial-dash-det-negociando/modal-comercial-dash-det-negociando.page';
import { ModalComercialDashDetLeadsPage } from './../../../../modals/comercial/dash/modal-comercial-dash-det-leads/modal-comercial-dash-det-leads.page';
import { ModalController, Platform } from '@ionic/angular';
import { Itconfusuario } from './../../../../interface/configuracoes/usuario/itconfusuario';
import { UsuariosService } from 'src/app/services/seguranca/usuarios.service';
import { ComercialService } from 'src/app/services/comercial/comercial.service';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ServAtendimentoService } from 'src/app/services/atendimento/serv-atendimento.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Subscription } from 'rxjs';
import { PainelComercial } from 'src/app/interface/comercial/painel';
import { Conversas } from 'src/app/interface/chat/conversas';
import { Chart } from 'chart.js';
import { Pedidos } from 'src/app/interface/comercial/pedidos';
import { HomedeskPage } from 'src/app/pages/homedesk/homedesk.page';
import { DisplayEventService } from 'src/app/provider/display-event.service';
import { Representantes } from 'src/app/interface/comercial/representantes';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';

@Component({
  selector: 'app-comp-comercial-home',
  templateUrl: './comp-comercial-home.component.html',
  styleUrls: ['./comp-comercial-home.component.scss'],
})

export class CompComercialHomeComponent implements OnInit {

  @ViewChild("barCanvas",{static:true}) barCanvas: ElementRef;

  public dadosDash  = {leads:0,negociando:0,ganhamos:0,perdemos:0}
  public itens = [1,2,3,4];

  public pedidosList = [];
  public pedidosFiltered : any[] = [];
  public representanteList = new Array<Representantes>()
  public representantesFiltered : any[] = [];
  public produtosList = new Array();
  public produtosFiltered : any[] = [];
  public device : string = 'desktop';
  public parceirosItens = []
  constructor(
    private eventEmitterService:ProvEmitterEventService,
    private design:ProcessosService,
    private afa:AngularFireAuth,
    private servAtendimentoService:ServAtendimentoService,
    private srvComercial:ComercialService,
    private srvUsuario:UsuariosService,
    private ctrlModal:ModalController,
    private platform : Platform,
    private displayContainers : DisplayEventService,
    private srvParceiro:ParceirosService
  ) { 
  
  }
  ngOnDestroy(){

  
  }
  ngOnInit() {
    if(this.platform.is('hybrid')){
      this.device = 'mobile';
    }

    console.log(this.device);

    //LISTAR PARCEIROS
    this.parceiroAll()
  }

  async parceiroAll()
  {
    this.srvParceiro.parceirosGetAll().forEach(element=>{
      if(!element.empty)
      {
        element.docs.forEach(dados=>{
          const id = dados.id
          const data = dados.data()
          const addItem = {
            id,
            ... data
          }
          this.parceirosItens.push(addItem)
        })
      }
    })
  }

  ngAfterViewInit()
  {

    //CARREGAR DADOS DO DASH
    //this.loadProdutos();

    //CARREGAR PEDIDOS
    this.loadPedidos();

    //CARREGAR REPRESENTANTES
    //this.loadRepresentantes();

  }

  functionExecute(functionName:string,params:any)
  {
    const param = {
      function:functionName,
      data:params
    };
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  async searchPedidos(event : string)
  {

    if(event == '')
    {
      this.loadPedidos();
    }
    else
    {
      this.pedidosList = [];
      this.pedidosFiltered = [];

      console.log(event);

      (await this.srvComercial.filterPedido(event)).subscribe(pedidos=>{
        pedidos.forEach(pedido => {
          if (pedido !== undefined) {
            this.pedidosList.push(pedido);
          }
        }); 
        console.log(pedidos);
      });
    }
    
  }

  async searchRepresentantes(event : string)
  {

    if(event == '')
    {
      this.loadRepresentantes();
    }
    else
    {
      this.representanteList = [];
      this.representantesFiltered = [];

      console.log(event);

      await this.srvComercial.filterRepresentante(event).subscribe(representantes=>{
        representantes.forEach(representante => {
          if (representante !== undefined) {
            this.representanteList.push(representante);
          }
        });
      });
    }
    
  }

  loadPedidos(){
    this.srvComercial.getAll().subscribe(dados=>{
      console.log(dados)
      this.pedidosList = dados;
    });
  }

  loadRepresentantes(){
    this.srvComercial.repEstatisticaGetAll().subscribe(dados=>{
      this.representanteList = dados;
    });
  }

  loadProdutos(){
    this.srvComercial.checkDasht().subscribe(dados=>{ 
      //this.dadosDash = dados;
    })
  }

  fullscreenMode(params : string){
    if (params) {
      if (this.displayContainers.leftContainer == 'none') {
        this.displayContainers.fullscreenMode();
      }
      this.functionExecute('btnBack',{componente:'home'});
      return;
    }
    this.displayContainers.fullscreenMode();
  }

  abrirOrcamento(uid?:string)
  {
  
    this.functionExecute('CompPedidoAdd',{uid})
   
  }
  pedidoDelete(id:string)
  {

    this.design.presentAlertConfirm(
      'Exclusão',
      'Confirma excluir pedido?'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Apagando...')
        .then(resLoading=>{
          resLoading.present();
          this.srvComercial.PedidoDelete(id)
          .then(res=>{
            this.design.presentToast(
              'Excluido com sucesso',
              'success',
              300
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao excluir',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoading.dismiss();
          })
        })
      }
    })
  }

  async abrirDetLead() {
    const modal = await this.ctrlModal.create({
      component: ModalComercialDashDetLeadsPage,
      cssClass: 'selector-modal'
    });
    return await modal.present();
  }

  async abrirDetnegociando() {
    const modal = await this.ctrlModal.create({
      component: ModalComercialDashDetNegociandoPage,
      cssClass: 'selector-modal'
    });
    return await modal.present();
  }

}
