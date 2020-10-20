import { UserService } from 'src/app/services/global/user.service';
import { Pedidositens } from 'src/app/interface/comercial/pedidositens';
import { PeditemeditPage } from './../../../../../modals/comercial/peditemedit/peditemedit.page';

import { ModestoqueconsultaPage } from './../../../../../modals/estoque/modestoqueconsulta/modestoqueconsulta.page';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { ComercialService } from './../../../../../services/comercial/comercial.service';
import { ProcessosService } from './../../../../../services/design/processos.service';
import { CondpagamentoService } from './../../../../../services/financeiro/configuacoes/condpagamento.service';
import { Component, OnInit, Input } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Subscription } from 'rxjs';
import { Itcondpagamento } from 'src/app/interface/financeiro/configuracoes/itcondpagamento';
import { Pedidos } from 'src/app/interface/comercial/pedidos';


//GERACAO DE PDF
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ModalpedidoenviarPage } from 'src/app/modals/comercial/pedido/modalpedidoenviar/modalpedidoenviar.page';
import { noUndefined } from '@angular/compiler/src/util';
import { Conversas } from 'src/app/interface/chat/conversas';
import { ConsultaPage } from 'src/app/modals/parceiros/consulta/consulta.page';
import { ProdutosService } from 'src/app/services/produtos/produtos.service';
import { ModalfiscalnotaviewPage } from 'src/app/modals/fiscal/notas/modalfiscalnotaview/modalfiscalnotaview.page';
import { ModalfiscalcfopPage } from 'src/app/modals/fiscal/emissao/apoio/modalfiscalcfop/modalfiscalcfop.page';
import { LancamentosParcelaPage } from 'src/app/modals/financeiro/apoio/lancamentos-parcela/lancamentos-parcela.page';
import { ModalcomapoiohistoricoPage } from 'src/app/modals/comercial/apoio/historico/modalcomapoiohistorico/modalcomapoiohistorico.page';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-comp-pedido-add',
  templateUrl: './comp-pedido-add.component.html',
  styleUrls: ['./comp-pedido-add.component.scss'],
})
export class CompPedidoAddComponent implements OnInit {
  @Input() data: any;

  private orcamentoUid:string
  public itensLancados = []
  private dadosOrcamento = {
    createAt: new Date().getTime(),
    parceiroUid:'',
    parceiroNome:'',
    parceiroUF:'',
    transportadoraUid:'',
    transportadoraNome:'',
    vendedorUid:'',
    vendedorNome:'',
    frete:'',
    condPagamento:'',
    situacaoCod:0,
    situacaoNome:'Novo',
    numero:'',
    validade:'',
    pedidoCompra:'',
    total:0,
    cfop:"",
    cfopDescricao:"",
    cfopTipoOperacao:"",
    cfopPISAliq:0,
    cfopPISsituacaoTributaria:'',
    cfopPISsituacaoTributariaNome:'',
    cfopCOFINSAliq:0,
    cfopCOFINSsituacaoTributaria:'',
    cfopCOFINSsituacaoTributariaNome:''

  }

  private dadosOrcamentoNewItem ={
    uid:'',
    codigo:'',
    descricao:'',
    ncm:'',
    cest:'',
    vrUnitario:0,
    quantidade:0,
    unidadeMedida:"",
    vrTotal:0,
    cfop:'',
    cfopDescricao:'',
    pesoL:0,
    pesoB:0,
    impostos:{
      icms:{
        situacaoTributaria:"",
        situacaoTributariaNome:"",
        origem:"",
        aliquota:0,
        aliquotaST:0,
        percentualMargemValorAdicionadoST:0,
        modalidadeBaseCalculoST:0,
        baseCalculoST:0,
        valorST:0
      

      },
      ipi:{
        situacaoTributaria:"",
        situacaoTributariaNome:"",
        porAliquota:{
          aliquota:0
        }
      },
      pis: {
        situacaoTributaria: "",
        situacaoTributariaNome:"",
        porAliquota: {
          aliquota: 0
        }
      },
      cofins: {
        situacaoTributaria: "",
        situacaoTributariaNome:"",
        porAliquota: {
          aliquota: 0
        }
      }
    }

  }

  private dadosOrcamentoNewItemVazio = {
    uid:'',
    codigo:'',
    descricao:'',
    ncm:'',
    cest:'',
    vrUnitario:0,
    quantidade:0,
    unidadeMedida:"",
    vrTotal:0,
    cfop:'',
    cfopDescricao:'',
    pesoL:0,
    pesoB:0,
    impostos:{
      icms:{
        situacaoTributaria:"",
        situacaoTributariaNome:"",
        origem:"",
        aliquota:0,
        aliquotaST:0,
        percentualMargemValorAdicionadoST:0,
        modalidadeBaseCalculoST:0,
        baseCalculoST:0,
        valorST:0
      

      },
      ipi:{
        situacaoTributaria:"",
        situacaoTributariaNome:"",
        porAliquota:{
          aliquota:0
        }
      },
      pis: {
        situacaoTributaria: "",
        situacaoTributariaNome:"",
        porAliquota: {
          aliquota: 0
        }
      },
      cofins: {
        situacaoTributaria: "",
        situacaoTributariaNome:"",
        porAliquota: {
          aliquota: 0
        }
      }
    }

  }
  private orcamentoItens = []



  //VARIAVEIS ANTIGAS

  private  titulo:string = 'Orçamento'
  private paranVoltar:any = [];
  private FunctionVoltar:string = '';


  private pedidoUid: string = null;
  private notaUid:string;
  private dadosPedido: Pedidos = {};
  private PedpedidoSubscription: Subscription;

  private condpagamentoItemsList = new Array<Itcondpagamento>();
  private PedcondpagamentoSubscription: Subscription;

  private conversaUid: string = null;
  private dadosConversa: Conversas = {};
  
  private checkPedidoSubscription: Subscription;



  private pedidoItens = Array<Pedidositens>()
  private pedidoItensSubscription: Subscription

  public vrtTotalAntigo = 0;
  public Vrtotal:number =0
  public totalAnterior = 0;

  //PDF
  letterObj = {
    to: '',
    from: '',
    text: '',
    assinatura:''
  }
 
  pdfObj = null;


  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvCondPagamento:CondpagamentoService,
    private srvComercial:ComercialService,
    private srvConversas:ConversasService,
    private design:ProcessosService,
    private afa:AngularFireAuth,
    private ctrlModal:ModalController,
    private global:UserService,
    private srvProdutos:ProdutosService,
    private srvParceiro:ParceirosService
  ) { }

  async abrirCFOP(){
    const modal = await this.ctrlModal.create({
      component: ModalfiscalcfopPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        const dataReturn                                      = data.data
        const nome                                            = dataReturn.codigo+" - "+dataReturn.nome
        this.dadosOrcamento.cfopDescricao                     = nome
        this.dadosOrcamento.cfop                              = dataReturn.cfop  
        this.dadosOrcamento.cfopTipoOperacao                  = dataReturn.tipoOperacao
        this.dadosOrcamento.cfopPISAliq                       = Number(dataReturn.impostos.pis.aliquota)
        this.dadosOrcamento.cfopPISsituacaoTributaria         = dataReturn.impostos.pis.situacaoTributaria
        this.dadosOrcamento.cfopPISsituacaoTributariaNome     = dataReturn.impostos.pis.situacaoTributariaNome
        this.dadosOrcamento.cfopCOFINSAliq                    = Number(dataReturn.impostos.cofins.aliquota)
        this.dadosOrcamento.cfopCOFINSsituacaoTributaria      = dataReturn.impostos.pis.situacaoTributaria
        this.dadosOrcamento.cfopCOFINSsituacaoTributariaNome  = dataReturn.impostos.pis.situacaoTributariaNome
        
      }
    });

    await modal.present();
  }

  functionExecute(functionName:string,params:any)
  {



    console.log('preparando '+ functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  async abrirNotaView() {

    const dadosEnviarNota = {
      id:this.pedidoUid,
      ... this.dadosOrcamento
    }

    const modal = await this.ctrlModal.create({
      component: ModalfiscalnotaviewPage,
      cssClass: 'selector-modal',
      componentProps: {
        dadosPedido:dadosEnviarNota
      }
    });
    return await modal.present();
  }

  async abrirNotaViewVer(notaUid:string) {

    const dadosEnviarNota = {
      id:this.pedidoUid,
      ... this.dadosOrcamento
    }

    const modal = await this.ctrlModal.create({
      component: ModalfiscalnotaviewPage,
      cssClass: 'selector-modal',
      componentProps: {
        notaUid
      }
    });
    return await modal.present();
  }



  infoCampoAutomatico()
  {
    if(this.dadosOrcamento.numero == '')
    {
      this.design.presentToast(
        'Este campo será preenchido automaticamente quando gravar o orçamento',
        'secondary',
        0,
        true
      )
    }
    
  }
  pedidoItensListar()
  {
    
    if(this.pedidoUid)
    {
      this.pedidoItensSubscription = this.srvComercial.getAllItensPedido(this.pedidoUid).subscribe(dados=>{
      
        this.pedidoItens = dados;

        //calculando
        let vrTotal = 0;
        dados.forEach(element => {
          vrTotal = vrTotal + element.vrTotal
        });

        this.Vrtotal = vrTotal;
        if(this.vrtTotalAntigo == 0)
        {
          this.vrtTotalAntigo = this.Vrtotal;
        }
        this.dadosPedido.total = vrTotal;
       
      })
    }
   
     
      
   
  }
  pedidosItensDelete(idItem:string)
  {
    this.design.presentAlertConfirm(
      'Excluir item',
      'Deseja excluir este item do orçamento?',
      'SIM',
      'Não'
    )
    .then(res=>{
      if(res)
      {
        this.design.presentLoading('Excluindo...')
        .then(resLoading=>{
          resLoading.present();
          this.srvComercial.PedidosItensDelete(this.pedidoUid,idItem)
          .then(resDelete=>{
            this.design.presentToast(
              'Item excluido com sucesso.',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao excluir item',
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
  gravarItens(dados:any):Promise<any> {

    return new Promise((resolve,reject)=>{
      this.design.presentLoading('Gravando itens...')
      .then(resLoading=>{
        resLoading.present()

        //ajustando campo 
        dados.quantidade  = Number(dados.quantidade)
        dados.vrUnitario  = Number(dados.vrUnitario)
        dados.vrTotal     = Number(dados.vrUnitario*dados.quantidade)  


        this.srvComercial.PedidosItensAdd(this.pedidoUid,dados,this.dadosOrcamento.parceiroUF)
        .then(resAddUtebs=>{
          resolve()
        })
        .catch(err=>{
          console.log('Falha ao inserir item')
          reject(err)
        })
        .finally(()=>{
          resLoading.dismiss()
        })
        
      })  
    })

    
  }
  gravar()
  {



    this.validarDados()
    .then(res=>{

      this.design.presentAlertConfirm(
        'Confirmação',
        'Confirma gravar?',
        'Sim',
        'Não'
        )
        .then(resConfirm=>{
          if(resConfirm)
          {
            if(!this.pedidoUid)
            {
              
              this.design.presentLoading('Criando movimentação...')
              .then(resLoading=>{
                resLoading.present()

                


                this.srvComercial.PedidoAdd(this.dadosOrcamento)
                .then(resAdd=>{
                  this.design.presentToast(
                    'Movimentação criada com sucesso',
                    'success',
                    3000
                  )
               
                  this.pedidoUid = resAdd.id
                  this.abrirDadosDoPedido(this.pedidoUid)
                  .then(()=>{
                    this.ItensListar()
                  })
                  .catch(errOpenPedido=>{
                    console.log(errOpenPedido)
                    console.log('Falha ao abrir dados do pedido ')
                  })  
                  //listando itens da nota fiscal
                 


                 
                })
                .catch(err=>{
                  console.log(err)
                  this.design.presentToast('Falha ao tentar gravar orçamento','danger',0,true)
                })
                .finally(()=>{
                  resLoading.dismiss()
                })
                
              })
          
              
            }
            else
            {
              this.design.presentLoading('Atualizando...')
              .then(resLoading=>{
                resLoading.present()
                this.srvComercial.PedidoAtualizar(this.pedidoUid,this.dadosOrcamento)
                .then(resUpdate=>{
                  this.design.presentToast(
                    'Atualizado com sucesso',
                    'success',
                    3000
                  )
                })
                .catch(err=>{
                  console.log(err)
                  this.design.presentToast(
                    'Falha ao processar atualização',
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
          }
        })

     
    })
    .catch(erroInserir=>{
      if (erroInserir.situacao == 'suc')
      {
         this.design.presentToast(
           erroInserir.msg,
           'warning',
           0,
           true
         )
      }
    })
  }
  validarDados():Promise<any>
  {
    return new Promise((resolve,reject)=>{
      if(this.dadosOrcamento.parceiroUid == '')
      {
          reject({situacao:'suc',code:0,msg:'Selecione um parceiro antes de continuar'})
      }
      
      if(this.dadosOrcamento.frete != "SemFrete")
      {
        if(this.dadosOrcamento.transportadoraUid == '')
        {
          reject({situacao:'suc',code:0,msg:'Selecione transportadora'})
        }
        
          
      }
      

    


      resolve()

      
    })
    
  }
  limparCampo(event:any,apenas:any)
  {
    
    if(apenas === 'number')
    {
      //event.target.value = event.target.value.replace(/[^0-9]*/g, '');
      //event.target.value =  event.target.value.replace(/[-][\d]*[.]{0,2}[\d]+/g, '');
      event.target.value = event.target.value.replace(/[^0-9]*[,]/g, '');
    }
  }
  async abrirDadosDoPedido(pedidoUid:string)
  {

    this.dadosOrcamento = <any>this.srvComercial.PedidoGet(pedidoUid).subscribe(dados=>{
      console.log(dados)
      this.dadosOrcamento = dados
    })
  }
  ngOnInit() {
    
    //SETAR PARAMETROS DE VOLTA

    if(this.data.uid)
    {
      this.pedidoUid = this.data.uid
      console.log(this.pedidoUid)
      this.abrirDadosDoPedido(this.pedidoUid)
      .then(()=>{
        this.ItensListar()
      })
      
      
      
     
      
      //this.FunctionVoltar = 'chatConversaOpen';
      //this.paranVoltar = {
      //  conversaUid:this.data.conversaUid,
      //  contatoUid:this.data.dadosConversa.contatoUid,
      //  situacao:this.data.dadosConversa.situacao
      //}

      //if(this.data.dadosConversa)
      //{
      //  this.conversaUid = this.data.conversaUid;
      //  this.dadosConversa = this.data.dadosConversa;
      //  console.log(this.dadosConversa);
      //  this.pedidoUid = this.data.dadosConversa.comercialUidOrcamento;
        
      //}
    }
    else
    {
      this.dadosOrcamento.vendedorNome    = this.afa.auth.currentUser.displayName
      this.dadosOrcamento.vendedorUid     = this.afa.auth.currentUser.uid
    }

   
    


   
    


  }
  ItensListar()
  {
    try
    {
      this.srvComercial.PedidosItensGetAll(this.pedidoUid).forEach(element=>{
        console.log(element)
        this.dadosOrcamento.total = 0;
        this.orcamentoItens = []
        element.forEach((dados:any)=>{
          const vrTotal  = dados.quantidade * dados.vrUnitario
          this.dadosOrcamento.total += vrTotal
  
          const addItem = {
          
            vrTotal,
            ... dados
          }
          this.orcamentoItens.push(addItem)
        })
       
      })
    }
    catch(err){
      console.log(err)
    }
   
  }
  ItensAddList()
  {
    if(this.pedidoUid)
    {
      
    
      this.ItensListar()
    }
    else
    {
      this.design.presentToast(
        'Primeiro grave o pedido antes de adicionar os itens',
        'warning',
        0,
        true
      )
    }
  }
  async abrirHistorico(){
    const modal = await this.ctrlModal.create({
      component: ModalcomapoiohistoricoPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        parceiroUid:this.dadosOrcamento.parceiroUid
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        
      }
    })

    await modal.present();
  }
  async abrirLancamentoDuplicatas()
  {

    if(!this.pedidoUid)
    {
      return this.design.presentToast(
        'Grave o pedido antes de adicionar os laçamentos financeiros',
        'warning',
        0,
        true
      )
    }
    const modal = await this.ctrlModal.create({
      component: LancamentosParcelaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        pedidoUid:this.pedidoUid
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        
      }
    })

    await modal.present();
  }
  NewItemAdd()
  {

    if(!this.pedidoUid)
    {
      return this.design.presentToast(
        'Antes de adicionar os itens grave o pedido',
        'warning',
        0,
        true
      )
    }
    if(this.dadosOrcamento.cfop == '')
    {
      return this.design.presentToast(
        'Selecione CFOP da operação',
        'warning',
        0,
        true
      )
    }

    this.design.presentLoading('Inserindo ... ')
    .then(resLoading=>{
      resLoading.present()
    

      //DEFINIDNDO DADOS DO CFOP 
      this.dadosOrcamentoNewItem.cfop                                   = this.dadosOrcamento.cfop
      this.dadosOrcamentoNewItem.cfopDescricao                          = this.dadosOrcamento.cfopDescricao
      this.dadosOrcamentoNewItem.impostos.cofins.porAliquota.aliquota   = <any>this.dadosOrcamento.cfopCOFINSAliq
      this.dadosOrcamentoNewItem.impostos.cofins.situacaoTributaria     = <any> this.dadosOrcamento.cfopCOFINSsituacaoTributaria
      this.dadosOrcamentoNewItem.impostos.cofins.situacaoTributariaNome = <any> this.dadosOrcamento.cfopCOFINSsituacaoTributariaNome
      this.dadosOrcamentoNewItem.impostos.pis.porAliquota.aliquota      = <any> this.dadosOrcamento.cfopPISAliq
      this.dadosOrcamentoNewItem.impostos.pis.situacaoTributaria        = this.dadosOrcamento.cfopPISsituacaoTributaria
      this.dadosOrcamentoNewItem.impostos.pis.situacaoTributariaNome    = this.dadosOrcamento.cfopPISsituacaoTributariaNome

      console.log


      const dadosAdd = this.dadosOrcamentoNewItem
      this.gravarItens(dadosAdd)
      .then(resAddItem=>{
        //LIMPAR ITENS
        this.dadosOrcamentoNewItem = this.dadosOrcamentoNewItemVazio
        this.dadosOrcamentoNewItem.descricao      = ""
        this.dadosOrcamentoNewItem.quantidade     = 0
        this.dadosOrcamentoNewItem.vrTotal        = 0
        this.dadosOrcamentoNewItem.vrUnitario     = 0
        this.dadosOrcamentoNewItem.codigo         = ""


       

        this.ItensListar()
        
      })
      .catch(errAddItem=>{
        console.log(errAddItem)
      })
      .finally(()=>{
        resLoading.dismiss()
      })
    })
    

    
    
    

  }
  consultarProduto(codProduto:string)
  {
    if(codProduto !== '')
    {
      this.design.presentLoading('Consultando produto...')
      .then(resLoading=>{
        resLoading.present()
        this.srvProdutos.produtoConsultaCod(codProduto).then((resProduto:any)=>{
          if(resProduto.situacao == 'suc')
          {
            if(resProduto.data[0])
            {
              console.log(resProduto.data)
              const dataReturn = resProduto.data[0]
              this.dadosOrcamentoNewItem.descricao = dataReturn.descricaoFiscal
              this.dadosOrcamentoNewItem.quantidade = 0
              this.dadosOrcamentoNewItem.uid = dataReturn.id
              this.dadosOrcamentoNewItem.vrUnitario = dataReturn.vrVenda
              this.dadosOrcamentoNewItem.vrTotal = 0
              this.dadosOrcamentoNewItem.ncm = dataReturn.ncm

        

            }
            else
            {
              this.design.presentToast(
                'Nao existe resultados para esta consulta',
                'secondary',
                5000
              )
            }
          }
        })
        .catch(err=>{
          console.log(err)
          this.design.presentToast(
            'Houve uma falha ao consultar o produto. '+err,
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
  }

  async AbrirConsultaParceiros(origem)
  {
  

    const modal = await this.ctrlModal.create({
      component: ConsultaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        origem
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        const dadosRecebidos = dados.data.dados
        if(origem === 'orc-parceiro')
        {
          this.dadosOrcamento.parceiroNome  = dadosRecebidos.razaoSocial,
          this.dadosOrcamento.parceiroUid   = dadosRecebidos.uid 

          this.design.presentLoading('Vinculando parceiro ')
          .then(resLoading=>{
            resLoading.present()
            this.srvParceiro.get(dadosRecebidos.uid).subscribe((elementParceiro:any)=>{
              resLoading.dismiss()
            
              this.dadosOrcamento.parceiroUF  = elementParceiro.endereco.estado
              console.log(this.dadosOrcamento)
            })   
          })


         
        }
        else if(origem === 'orc-transportadora')
        {
          this.dadosOrcamento.transportadoraNome  = dadosRecebidos.razaoSocial
          this.dadosOrcamento.transportadoraUid   = dadosRecebidos.uid
        }
        else
        {
          this.design.presentToast(
            'O tipo de origem não esta tratado para uso',
            'danger',
            0,
            true
          )
        }

      }
    })

    await modal.present();
  }
  ngAfterViewInit()
  {
     //CARREGAR CONDICOES DE PAGAMENTO
     this.PedcondpagamentoSubscription = this.srvCondPagamento.getAll().subscribe(data => {
  
      this.condpagamentoItemsList = data;

    })

    
  }
  ngOnDestroy()
  {
    
    

    
  }
  AtualizarInformacoesComerciais()
  {
    this.design.presentLoading('Atualizando informações...')
    .then(resLoading=>{
      resLoading.present()

      if(this.vrtTotalAntigo != this.Vrtotal)
      {
        let dadosHistorico = [];
        if(this.dadosPedido.negociacaoHistorico !== undefined)
        {
          dadosHistorico = JSON.parse(this.dadosPedido.negociacaoHistorico);
        }
        



        const novoHistorico = {
          createAt: new Date().getTime(),
          valor:this.Vrtotal,
          tipo:'negociacao',
          qtdItens:this.pedidoItens.length,
          usuarioUid:this.afa.auth.currentUser.uid,
          usuarioNome:this.afa.auth.currentUser.displayName
        }
        dadosHistorico.push(novoHistorico)
        console.log('Historico negociacao : '+JSON.stringify(dadosHistorico));

        this.dadosPedido.negociacaoHistorico = JSON.stringify(dadosHistorico)

        
        


        
      }



      this.dadosConversa.intencao = 'comercial';
      this.dadosConversa.valor = this.dadosPedido.total;
      this.dadosConversa.comercialUidOrcamento = this.pedidoUid;

      this.srvConversas.update(this.conversaUid,this.dadosConversa)
      .then(resUpdate=>{

        console.log(this.dadosPedido)
        this.srvComercial.update(this.pedidoUid,this.dadosPedido)
        .then(resUpdatePedido=>{
          this.design.presentToast(
            'Dados atualizados com sucesso',
            'success',
            3000
          )
        })
        .catch(err=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao atualizar dados comerciais',
            'danger',
            0,
            true
          )
        })
        .finally(()=>{
          resLoading.dismiss();
        })


        
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Falha ao atualizar dados da conversa',
          'danger',
          0,
          true
        )
      })
      .finally(()=>{
        console.log('Conversa atualizada ')
      })
    })
  }
  pedidoCriar()
  {
    if(this.dadosConversa)
    {
        this.design.presentLoading('Criando...')
        .then(resLoading=>{
          resLoading.present();
        
          this.dadosPedido.clienteNome  = this.dadosConversa.nomeClienteVinculado
          this.dadosPedido.clienteUid   = this.dadosConversa.uidClienteVinculado
          this.dadosPedido.contatoNome  = this.dadosConversa.contatoNome
          this.dadosPedido.contatoUid   = this.dadosConversa.contatoUid
          
         

          this.srvComercial.add(this.dadosPedido)
          .then(resComercial=>{
            console.log(resComercial)
            this.pedidoUid = resComercial.id
            
            //ATUALIZAR DADOS DE CONVERSA
            this.dadosConversa.comercialUidOrcamento = this.pedidoUid
            this.dadosConversa.intencao = 'comercial'
            this.srvConversas.update(this.conversaUid,this.dadosConversa)
            .then((resConversas)=>{
              
              //INICIAR OBSEVACAO DE ITENS
              this.pedidoItensListar();
             
              this.design.presentToast(
                'Orçamento criado com sucesso',
                'success',
                3000
              )
            })
            .catch(err=>{
              console.log(err);
              this.design.presentToast(
                'Falha ao vincular dados do orçamento a conversa',
                'danger',
                0,
                true
              )
            })
            .finally(()=>{

            })


           
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao criar orçamento',
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
    else
    {
      this.design.presentToast(
        'Para criar um orçamento é necessário que você tenha uma conversa iniciada',
        'warning',
        0,
        true
      )
    }
  }
  pedidoCarregar()
  {
    this.design.presentLoading('Carregando...')
    .then(resLoading=>{
      resLoading.present()
      this.PedpedidoSubscription = this.srvComercial.get(this.pedidoUid).subscribe(data => {
        
        
        this.dadosPedido = data;
        this.totalAnterior = data.total;
        this.titulo = this.dadosPedido.situacao

        this.pedidoItensListar();
        
        try
        {
          resLoading.dismiss();
        }
        catch(err)
        {

        }
        
      })
     
    })
  }
  async pedidoEnviar(){
    const dadosPedSend = { id:this.pedidoUid, ... this.dadosPedido}
 
    const modal = await this.ctrlModal.create({
      component: ModalpedidoenviarPage,
      cssClass: 'selector-modal',
      componentProps:{
        dadosConversa:this.data,
        dadosPedSend,
        pedidoItemsList:this.pedidoItens
      }
    });
    return await modal.present();
  }
  async estoqueAbrirConsulta() {

    const dadosPedSend = { id:this.pedidoUid, ... this.dadosPedido}

    const modal = await this.ctrlModal.create({
      component: ModestoqueconsultaPage,
      cssClass: 'selector-modal',
      componentProps:{
        dadosPedido:dadosPedSend
      }
    });
    return await modal.present();
  }

  async pedidoItemEditar(itemUid:string) {

 

    const modal = await this.ctrlModal.create({
      component: PeditemeditPage,
      cssClass: 'selector-modal',
      componentProps:{
        pedidoUid:this.pedidoUid,
        itemUid
      }
    });
    return await modal.present();
  }

  

}
