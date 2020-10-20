import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { ModalatfiltrosdataPage } from 'src/app/modals/atendimento/filtros/modalatfiltrosdata/modalatfiltrosdata.page';
import { ModaluserselecionarPage } from 'src/app/modals/usuarios/modaluserselecionar/modaluserselecionar.page';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { AtendimentoService } from 'src/app/services/configuracoes/atendimento.service';
import { ServAtendimentoDepartamentoService } from 'src/app/services/configuracoes/atendimento/departamento/serv-atendimento-departamento.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-compcasosreldetalhe',
  templateUrl: './compcasosreldetalhe.component.html',
  styleUrls: ['./compcasosreldetalhe.component.scss'],
})
export class CompcasosreldetalheComponent implements OnInit {


  private departamentos   = []
  private tipos           = []
  private relatorioItems  = []
  private dashTotal       = 0
  private dashSemResposta = 0
  private dashEmAndamento = 0
  private dashFinalizados = 0
  public queryStr:QueryFn;
  private filtroSelect = {
    operador:null,
    operadorUid:false,
    departamentoUid:'',
    tipoUid:'0',
    dataIni:null,
    dataFim:null,
    dataIniString:null,
    dataFimString:null,
  }
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvAtendimentoDepartamento:ServAtendimentoDepartamentoService,
    private ctrlModal:ModalController,
    private design:ProcessosService,
    private srvAtendimento:AtendimentoService
  ) { }

  ngOnInit() {

    //CARREGAR DEPARTAMENTOS
    this.srvAtendimentoDepartamento.getAll().forEach(elem=>{
      elem.sort(function(a:any,b:any) {
        return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
      }).forEach(dados=>{
        this.departamentos.push(dados)
      })
    
    })


    

  }
  processarRelatorio()
  {

    let filtros = [];
    filtros.push({campo:'createAt',condicao:'>=',valor:this.filtroSelect.dataIni})
    filtros.push({campo:'createAt',condicao:'<=',valor:this.filtroSelect.dataFim})

    if(this.filtroSelect.operadorUid != false && this.filtroSelect.operadorUid != null)
    {
      filtros.push({campo:'usuarioUid',condicao:'==',valor:this.filtroSelect.operadorUid})
    }
    if(this.filtroSelect.departamentoUid !== '')
    {
      filtros.push({campo:'departamentoUid',condicao:'==',valor:this.filtroSelect.departamentoUid})
    }
    if(this.filtroSelect.tipoUid !== '0')
    {
      filtros.push({campo:'tipoUid',condicao:'==',valor:this.filtroSelect.tipoUid})
    }

    if(filtros.length > 0)
    {
      console.log(filtros)
      
        
      this.queryStr = ref=>{
        let qr  : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        filtros.forEach(elem=>{
          qr = qr.where(elem.campo,elem.condicao,elem.valor)
        })
        
        return qr
      };

      this.srvAtendimento.relatorioCasos(this.queryStr).forEach(elem=>{
        this.relatorioItems   = []
        this.dashEmAndamento  = 0
        this.dashFinalizados  = 0
        this.dashSemResposta  = 0
        this.dashTotal        = 0
        console.log(elem)
        if(!elem.empty)
        {
          elem.docs.forEach(dados=>{
            const id = dados.id
            const data = dados.data()
            let situacaoNome = 'indefinido'
            this.dashTotal++
            if(data.novo == 1){ situacaoNome = 'novo'}
            if(data.qtdA > 0){ situacaoNome = 'Sem resposta';this.dashSemResposta++}
            if(data.qtdA == 0 && data.novo == 0 && data.situacao == 1){ situacaoNome = 'em andamento';this.dashEmAndamento++}
            if(data.situacao == 6){situacaoNome = 'Finalizado';this.dashFinalizados++}
            const dadosReturn = {
              id,
              situacaoNome,
              ... data
            }

            this.relatorioItems.push(dadosReturn)

          })
        }
      })
    }

      
      
     
      
       


    
  }
  carregarTipos()
  {
    if(this.filtroSelect.departamentoUid !== '' && this.filtroSelect.departamentoUid != '0')
    {
      console.log('Carregar tipos')
      //CARREGAR TIPOS
      this.tipos = []
      this.srvAtendimentoDepartamento.tipoGetAll(this.filtroSelect.departamentoUid).forEach(elem=>{
        elem.sort(function(a:any,b:any) {
          return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
        }).forEach(dados=>{
          this.tipos.push(dados)
        })
      
      })
    }
    
  }

  functionExecute(functionName:string,params:any)
  {
  
    const param = {
      function:functionName,
      data:params
    }
  

    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  async abrirModalFiltroUser(origem:string)
  {
    const modal = await this.ctrlModal.create({
      component: ModaluserselecionarPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        origem
      }
    });
    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        if(dados.data.acao == 'relatorios')
        {
          this.filtroSelect.operadorUid = dados.data.usuarioUid
          this.filtroSelect.operador = dados.data.usuarioNome
          //this.filterUser = dados.data.usuarioUid
         
        }
      }
    })
    await modal.present();
  }
  limparUser()
  {
    this.filtroSelect.operador = null,
    this.filtroSelect.operadorUid = false
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
  async gerarRelatorio()
  {
    console.log(this.filtroSelect)
    //VALIDACOES
    if(this.filtroSelect.dataIni === null || this.filtroSelect.dataFim === null)
    {
      return this.design.presentToast(
        'Selecione um periodo valido para seguir',
        'secondary',
        0,
        true
      )
    }


    //GERAR RELATORIO 
    this.processarRelatorio()

   
  }
}
