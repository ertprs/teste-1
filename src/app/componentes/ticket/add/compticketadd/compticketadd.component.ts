import { Component, OnInit, Input } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { AtendimentoService } from 'src/app/services/configuracoes/atendimento.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ModalController } from '@ionic/angular';
import { CasoeventoaddPage } from 'src/app/modals/casos/casoeventoadd/casoeventoadd.page';

@Component({
  selector: 'app-compticketadd',
  templateUrl: './compticketadd.component.html',
  styleUrls: ['./compticketadd.component.scss'],
})
export class CompticketaddComponent implements OnInit {
  
  @Input() data: any;

  
  private titulo:string = 'novo';
  private itemsDepto = []
  private itemsCasosTipo = []
  private dadosCaso = {
    numero:0,
    dataAbertura:'',
    usuarioUid:'',
    usuarioNome:'',
    departamentoUid:'',
    departamento:'',
    departamentoNome:'',
    contatoUid:'',
    contatoNome:'',
    parceiroUid:'',
    parceiroNome:'',
    tipo:'',
    tipoNome:'',
    tipoUid:'',
    assunto:'',
    detalhamento:'',
    qtdA:0,
    situacao:1
  }

  private dadosCasoDetalhe = []

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvAtendimento:AtendimentoService,
    private design:ProcessosService,
    private ctrlModal:ModalController
    
  ) { 


   

  }
  async carregarDadosTicket(uid:string)
  {
    try
    {
      console.log('Dados carregados')
      this.srvAtendimento.casoGet(uid).forEach(elem=>{
        if(elem.exists)
        {
          const dados = elem.data()
  
         
  
          this.dadosCaso = <any> dados
  
          //PREECHER DETALHES
          this.listarDetalhes()
          
        }
      })
    }
    catch(err)
    {
      console.log('Falha ao abrir dados do caso | '+err)
    }
    

  }
  ngOnInit() {

    if(this.data)
    {
      if(this.data.hasOwnProperty('casoUid'))
      {
        this.carregarDadosTicket(this.data.casoUid)
      }
      else
      {
         //CRIAR UM NOVO CASO
        this.carregarDepartamento()
      }

      //VERIFICAR DADOS DE CONVER
      if(this.data.hasOwnProperty('dadosConversa'))
      {
        const dadosConversa = this.data.dadosConversa

        this.dadosCaso.contatoNome  = dadosConversa.contatoNome
        this.dadosCaso.contatoUid   = dadosConversa.contatoUid
        
        this.dadosCaso.parceiroNome = dadosConversa.nomeClienteVinculado
        this.dadosCaso.parceiroUid  = dadosConversa.uidClienteVinculado
      }
    }
    

  }
  async addRegistroEvendo(dados:any)
  {
    this.design.presentLoading('Registrando...')
    .then(resLoading=>{
      resLoading.present()

      //PEGANDO NUMERO DO TICKET
      dados.ticketNumero = this.dadosCaso.numero

      this.srvAtendimento.casoRegistrarEvento(this.data.casoUid,dados)
      .then(()=>{
        this.dadosCaso.qtdA = 0;
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Falha ao incluir registro',
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
  encerrarChamado(){

    if(this.dadosCaso.qtdA > 0)
    {
      return this.design.presentToast(
        'Antes de encerrar este caso você precisa inserir um registro de evento',
        'secondary',
        0,
        true
      )
    }


    this.design.presentAlertConfirm(
      'Confirmação',
      'Posso encerrar este chamado agora?',
      'Manda ver',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Encerrando...')
        .then(resLoading=>{
          resLoading.present()
          this.srvAtendimento.casoFinalizar(this.data.casoUid)
          .then(()=>{
            this.design.presentToast(
              'Caso finalizado com sucesso',
              'success',
              4000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao processar encerramento do chamado',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoading.dismiss()
            this.functionExecute('btnBack',{componente:'home'})
          })

        })
      }
    })
  }
  async modalEventoAdd()
  {
  
   
    const modal = await this.ctrlModal.create({
      component: CasoeventoaddPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        dados:this.dadosCaso
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
       if(dados.data.acao == 'add')
       {
         const dadosAdicionar = dados.data.dados
        this.addRegistroEvendo(dadosAdicionar)
       }
      }
    })

    await modal.present();
  }
   listarDetalhes()
  {
    
    this.srvAtendimento.getCasoDetalhe(this.data.casoUid,ref => ref.orderBy('createAt','desc')).then(resDadosReturn=>{
      resDadosReturn.forEach(dados=>{
        console.log(dados)
        this.dadosCasoDetalhe = dados
      })
    })
    .catch(err=>{
      console.log('Falha ao listar detalhes do caso ')
    })

  }
  criarCaso()
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma criar um novo caso?',
      'Opa!',
      'Nop'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Criando...')
        .then(resLoading=>{
          resLoading.present()
          this.srvAtendimento.casoAdd(this.dadosCaso)
          .then(resAdd=>{
            this.data.casoUid = resAdd.id
            this.carregarDadosTicket(this.data.casoUid)
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Problemas ao criar casao ',
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
  SetDepto()
  {
    let deptoSelecionado = this.dadosCaso.departamento.split('|')
    let deptoNome = deptoSelecionado[1].trim()
    let deptoUid = deptoSelecionado[0].trim()
    this.dadosCaso.departamentoUid = deptoUid
    this.dadosCaso.departamentoNome = deptoNome

    //LIMPAR SELECAO DE TIPO 
    this.dadosCaso.tipo = '';
    this.dadosCaso.tipoUid = '';
    this.dadosCaso.tipoNome = ''
    


    
    this.carregarTipos(this.dadosCaso.departamentoUid)
  }
  SetCasoTipo()
  {
    let casoTipoSelecionado = this.dadosCaso.tipo.split('|')
    let tipoUid = casoTipoSelecionado[0]
    let tipoNome = casoTipoSelecionado[1]

    this.dadosCaso.tipoUid = tipoUid
    this.dadosCaso.tipoNome = tipoNome
  }
  async carregarTipos(deptoUid:string)
  {
    this.itemsCasosTipo = [];
    this.srvAtendimento.getCasosTipo(deptoUid).forEach(element=>{
      if(!element.empty)
      {
        element.forEach(dados=>{
          const id = dados.id
          const data = dados.data()
          const addItem = {
            id,
            ... data
          }
          this.itemsCasosTipo.push(addItem)
        })
      }
      else{
        this.design.presentToast(
          'Não existem tipos especificados para o departamento selecionado' ,
          'warning',
          5000
        )
      }
    })
  }
  async carregarDepartamento()
  {
    console.log('Carregando departamentos ')
    this.srvAtendimento.getAllConfDepartamentos().forEach(element=>{
      if(!element.empty)
      {
        element.docs.forEach(dados=>{
          const id = dados.id
          const data = dados.data()
          const addItem = {
            id,
            ... data
          }
         
          this.itemsDepto.push(addItem)
        })
      }
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

}
