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
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-comp-pedido-add',
  templateUrl: './comp-pedido-add.component.html',
  styleUrls: ['./comp-pedido-add.component.scss'],
})
export class CompPedidoAddComponent implements OnInit {
  @Input() data: any;



  private  titulo:string = 'Orçamento'
  private paranVoltar:any = [];
  private FunctionVoltar:string = '';


  private pedidoUid: string = null;
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
    private global:UserService
  ) { }
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
          this.srvComercial.pedidosItensDelete(this.pedidoUid,idItem)
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
  ngOnInit() {
    
    //SETAR PARAMETROS DE VOLTA
    if(this.data)
    {
      
      
      this.FunctionVoltar = 'chatConversaOpen';
      this.paranVoltar = {
        conversaUid:this.data.conversaUid,
        contatoUid:this.data.dadosConversa.contatoUid,
        situacao:this.data.dadosConversa.situacao
      }

      if(this.data.dadosConversa)
      {
        this.conversaUid = this.data.conversaUid;
        this.dadosConversa = this.data.dadosConversa;
        console.log(this.dadosConversa);
        this.pedidoUid = this.data.dadosConversa.comercialUidOrcamento;
        
      }
    }
    else
    {
      this.FunctionVoltar = 'btnBack';
      this.paranVoltar = {
        componente:'home'
      }
    }

   
    


   
    


  }
  ngAfterViewInit()
  {
     //CARREGAR CONDICOES DE PAGAMENTO
     this.PedcondpagamentoSubscription = this.srvCondPagamento.getAll().subscribe(data => {
  
      this.condpagamentoItemsList = data;

    })

    this.design.presentLoading('Aguarde...')
    .then(async resLoading=>{
      resLoading.present()
      //CHECAR SE EXISTE ORCAMENTO EM ABERTO
      
      this.checkPedidoSubscription =  this.srvComercial.checkOrcamentoEmAberto(this.dadosConversa).subscribe(data=>{
        if(data.length > 0)
        {
          this.checkPedidoSubscription.unsubscribe();
          let contItens = 0;
          let identPedidoUid;
          data.forEach(item=>{
            identPedidoUid = item.id;
            if(item.usuarioUid != this.afa.auth.currentUser.uid)
              {
                
                contItens++;
              }
          })


          if(contItens > 0)
          {
            resLoading.dismiss();
            this.design.presentToast(
              'Não é possível criar um  novo orçamento para este contato. Porque já existe um orçamento em aberto com outro usuário',
              'warning',
              0,
              true
            )
            this.functionExecute(this.FunctionVoltar,this.paranVoltar)
          }
          else
          { 
            resLoading.dismiss()
            
            if(data.length  == 1)
            {
              this.pedidoUid = identPedidoUid;
              this.pedidoCarregar();
            }
            else
            {
              alert('Existem orçamentos em aberto com outro contato')
            }
           
            
            
          }
          
        }
        else
        {
          resLoading.dismiss();
          //INICIAR PROCESSO PARA NOVO
          this.design.presentAlertConfirm(
            'Atividade  comercial',
            'Deseja criar um orçamento?',
            'Quero',
            'Não'
          )
          .then(resp=>{
            if(resp)
            {
              this.pedidoCriar();
            }
            else
            {
              this.functionExecute(this.FunctionVoltar,this.paranVoltar)
            }
          })
        }
        
      })
      


      
    })
  }
  ngOnDestroy()
  {
    this.PedcondpagamentoSubscription.unsubscribe();
    this.PedpedidoSubscription.unsubscribe();
    if(this.dadosConversa)
    {
      this.AtualizarInformacoesComerciais();

    }
    

    
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

  async pedidoItemEditar(dadosItem:Pedidositens) {

    const dadosPedSend = { id:this.pedidoUid, ... this.dadosPedido}

    const modal = await this.ctrlModal.create({
      component: PeditemeditPage,
      cssClass: 'selector-modal',
      componentProps:{
        pedidoUid:this.pedidoUid,
        dadosItem
      }
    });
    return await modal.present();
  }

  

}
