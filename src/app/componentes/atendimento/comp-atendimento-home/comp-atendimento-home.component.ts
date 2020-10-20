import { ModaluserselecionarPage } from './../../../modals/usuarios/modaluserselecionar/modaluserselecionar.page';
import { ModalatfiltrosdataPage } from './../../../modals/atendimento/filtros/modalatfiltrosdata/modalatfiltrosdata.page';
import { QueryFn } from '@angular/fire/firestore';
import { PopoveratdashfiltrosPage } from './../../../popover/atendimento/popoveratdashfiltros/popoveratdashfiltros.page';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController, PopoverController, LoadingController } from '@ionic/angular';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { subscribeOn } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ServAtendimentoService } from 'src/app/services/atendimento/serv-atendimento.service';
import { Chart } from 'chart.js';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Subscription } from 'rxjs';
import { ItAtendimentoDash } from 'src/app/interface/dashboard/it-atendimento-dash';
import { Conversas } from 'src/app/interface/chat/conversas';
import { TransferenciaPage } from 'src/app/modals/chat/transferencia/transferencia.page';
import { VisualizarconversaPage } from 'src/app/modals/chat/mensagem/visualizarconversa/visualizarconversa.page';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { UserService } from 'src/app/services/global/user.service';

@Component({
  selector: 'app-comp-atendimento-home',
  templateUrl: './comp-atendimento-home.component.html',
  styleUrls: ['./comp-atendimento-home.component.scss'],
})

export class CompAtendimentoHomeComponent implements OnInit {

  //@ViewChild('barCanvas', {  read: ElementRef,static:true })  public barCanvas;
  @ViewChild("barCanvas",{static:true}) barCanvas: ElementRef;
  // @ViewChild("canvasAtendimento",{static:true}) CanvasAtendimento: ElementRef;
  @ViewChild("canvasEmAtendimento",{static:true}) CanvasEmAtendimentoElem: ElementRef;
  public CanvasEmAtendimento: Chart;
  
  private barChart: Chart;

  // public itemsSubscription: Subscription;
  public dadosAtendimentoSubscribe: Subscription;
  // public dadosAtendimentoConversaSubscribe: Subscription;
  public conversasSubscribe: Subscription;

  public conversas = new Array<Conversas>();
  public conversasFiltered:any[] = [];
  public filtered:any[] = [];

  private dadosClassificacao = new Array();

  public scrollAuto:boolean = false;
  public filterString:string = 'filterCkTodos';

  public arrAux:number = 0;

  public dadosDash: ItAtendimentoDash = {};

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };


  //NOVAS VARIAVEIS
  public ckselecionar:boolean=false;
  public colorTool:string='white';

  public items=[];

  public queryStr:QueryFn;
  public itemsSelecionados=[]

  public dashAtLara:any;
  public dashAtSemOperador:number;
  public dashAtResposta:number;
  public dashAtEmAtendimento:number;
  public dashDados = {dashAtLara:0};

  public filterCkLara:boolean = true
  public filterCkSemOperador:boolean = true
  public filterCkSemResposta:boolean = true
  public filterCkEmAtendimento:boolean = true

  public filterTodosSelecionado:boolean;
  public filterData:any;
  public filterUser:any;

  private CalcularDiff(dt2:Number, dt1:Number) 
  {
    try
    {
      var diff =(<any>dt2 - <any>dt1);
      //diff /= (60 * 60);
      
      //diff = diff / 60000;
      return Math.floor(diff/1000/60)
      //return Math.abs(Math.round(diff));
    }
    catch(err)
    {
      return 0;
    }
   
    
  }

  constructor(
    private servAtendimentoService:ServAtendimentoService,
    private servConversas:ConversasService,
    private eventEmitterService: ProvEmitterEventService,
    private design:ProcessosService,
    private ctrlModal:ModalController,
    private afa:AngularFireAuth,
    private elementRef: ElementRef,
    private ctrlPopover:PopoverController,
    private ctrlLoading:LoadingController,
    private globalUser:UserService
  ) {
    // this.itemsSubscription = new Subscription;

    this.queryStr = ref=>ref.where('situacao','>=',1).where('situacao','<=',2);
   
  }
  async liberarFiltroData()
  {
      this.filterData = false;
      this.executarFilterCk();
  }
  async liberarFiltroUsuario()
  {
    this.filterUser = false;
    this.executarFilterCk();
  }
  async executarFilterCk()
  {
    

    this.design.presentLoading('Processando...')
    .then(resLoadign=>{
      resLoadign.present()
      
      let filtros = [];
      if(this.filterData)
      {
  
        
        filtros.push({campo:'createAt',condicao:'>=',valor:this.filterData.dataIni})
        filtros.push({campo:'createAt',condicao:'<=',valor:this.filterData.dataFim})
        
         
      }
     
      

      if(this.filterUser)
      {
        filtros.push({campo:'usuarioUid',condicao:'==',valor:this.filterUser})
      }




      if(this.filterString == "filterCkTodos")
      {
        
        if(!this.filterData)
        {
          filtros.push({campo:'situacao',condicao:'<',valor:6})
        }
       
        
    
    
      
        
      }
      if(this.filterString == "filterCkLara")
      {
      
        filtros.push({campo:'situacao',condicao:'==',valor:1})
      }
      
      if(this.filterString == "filterCkSemOperador")
      {
        filtros.push({campo:'situacao',condicao:'==',valor:2})
        filtros.push({campo:'usuarioUid',condicao:'==',valor:''})
      }

      if(this.filterString == "filterCkSemResposta")
      {
        filtros.push({campo:'situacao',condicao:'==',valor:2})
        filtros.push({campo:'slaAlerta',condicao:'==',valor:true})
      }

      if(this.filterString == "filterCkEmAtendimento")
      {
        filtros.push({campo:'situacao',condicao:'==',valor:2})
        filtros.push({campo:'slaAlerta',condicao:'==',valor:false})
        filtros.push({campo:'usuarioUid',condicao:'>=',valor:''})
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
          this.conversasListar()
          
       

        
        
       
        
      }
      else
      {
        resLoadign.dismiss();
      }
      
      

    })
  }
  
  async conversasListar()
  {
   (await this.servConversas.atendimentoListarFiltro(this.queryStr)).forEach(collecao=>{
    
    this.items=[]; 
    if(!collecao.empty)
     {
      this.dashAtResposta = 0;
       collecao.forEach(documento=>{
   

          const data = documento.data();
          const id = documento.id;
          const tagSemRespostaTime = this.CalcularDiff( new Date().getTime(), data.ultMensagemData );
          const tempoAdmitido = Number(this.globalUser.dadosLogado.confEmpAtendimento.atdMinAlerta);
         
          let tagSemResposta = 0;
          
          if(data.ultMensagemData > 0 )
          {
            if(tagSemRespostaTime > tempoAdmitido )
            {
              this.dashAtResposta = this.dashAtResposta+1
             
              tagSemResposta = 1;
              //UPDATE PARA ALERTA ATIVO
            }
          }
         
          
          const elem = {
            id,
            tagSemRespostaTime,
            tagSemResposta,
            ... data} 
         
       
          let checkConversa = this.items.reduce( function( cur, val, index ){

            if( val.id === elem.id  && cur === -1 ) {
                return index;
            }
            return cur;
        
        }, -1 );
        if(checkConversa == -1)
        {
          let selecionado = false;

          let checkSelecionados = this.itemsSelecionados.reduce( function( cur, val, index ){
              if( val.id === elem.id  && cur === -1 ) {
                  return index;
              }
              return cur;
          
          }, -1 );
          if(checkSelecionados > -1)
          {
            selecionado = true;
          }
          
          const infConversa ={
            selecionado,
            ...
            elem
          }  
          

          if(this.filterData)
          {
            //if(elem["situacao"] != 6)
            //{
              this.items.push(infConversa)
            //}
          }
          else
          {
            this.items.push(infConversa)
          }
          
        }
        else
        {
          this.items[checkConversa] = elem
        }



       })
       this.ctrlLoading.dismiss();
     }
     else
     {
      this.ctrlLoading.dismiss();
       console.log('dismmiss')
      
     }
   })
   
   this.ctrlLoading.dismiss();
   
  }
  ngAfterViewInit(){

    try
    {
      //CONTATOR LARA
      console.log('Carregando dash')
      this.filterString = 'filterCkTodos';
      this.servConversas.atendimentoListar(ref=>ref.where('situacao','==',2).where('slaAlerta','==',false)).then(dadosReturn=>{
        dadosReturn.subscribe(dados=>{
          
          let cont = 0;
          dados.forEach(elem=>{
            if(elem.usuarioUid != '')
            {
              cont++;
            }
          })
          console.log('Dados 1 = '+cont)
          this.dashAtEmAtendimento =  cont
        })
      })
      
      //this.servConversas.atendimentoListar(ref=>ref.where('situacao','==',2).where('slaAlerta','==',true)).then(dadosReturn=>{
      //  dadosReturn.subscribe(dados=>{
      //    console.log('Dados 2')
      //    this.dashAtResposta =  dados.length
      //  })
      //})
      
      this.servConversas.atendimentoListar(ref=>ref.where('situacao','==',2).where('usuarioUid','==','')).then(dadosReturn=>{
        dadosReturn.subscribe(dados=>{
          console.log('Dados 3')
          this.dashAtSemOperador =  dados.length
        })
      })

      this.servConversas.atendimentoListar(ref=>ref.where('situacao','==',1)).then(dadosReturn=>{

       
          dadosReturn.subscribe(dados=>{
            if(dados.length <=0 || !dados.length)
            {
              this.dashDados.dashAtLara = 0;
              this.dashAtLara = 0;
            }
            else
            {
              this.dashDados.dashAtLara = dados.length;
              
              this.dashAtLara =  dados.length
              console.log('Dados  = '+this.dashAtLara)
            }

            
          })
        
      
      })

      this.conversasListar();
    }
    catch(err)
    {
      console.log('** ERR **')
      console.log(err)
      
    }
    
    
  }
  habilitarSelecionar()
  {
    if(!this.ckselecionar)
    {
      this.colorTool = 'white'
      this.ckselecionar = true;
      this.dadosAtendimentoSubscribe.unsubscribe();
    }
    else
    {
      this.executarFilterCk();
      this.colorTool = 'slategrey'
      this.ckselecionar = false;
    }
  }
  ngOnDestroy(){
    // this.itemsSubscription.unsubscribe();
    //this.dadosAtendimentoSubscribe.unsubscribe();
    //this.conversasSubscribe.unsubscribe();
    // this.dadosAtendimentoConversaSubscribe.unsubscribe();
  }
  
  async selecionarTodos()
  {
    this.items.forEach(elem=>{
      this.itemsSelecionados.push(elem)
      elem.selecionado = true;
    })
    this.filterTodosSelecionado = true;
  }
  async limparTodos()
  {
    this.itemsSelecionados = [];
    this.items.forEach(elem=>{
      elem.selecionado = false;
    })
    this.filterTodosSelecionado = false;
  }
  async popoverFiltrosOpacao(ev: any) {
    const popover = await this.ctrlPopover.create({
      component: PopoveratdashfiltrosPage,
    
      event: ev,
      translucent: true,
      componentProps: {
        ckselecionar:this.ckselecionar,
        selecionarTodos:this.filterTodosSelecionado
      }
    });
    popover.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        if(dados.data == 'habilitar')
        {
         this.habilitarSelecionar();
   
        }
        else if(dados.data == 'transferir')
        {
          if(this.itemsSelecionados.length > 0)
          {
            this.abrirModalFiltroUser('transferir')
            console.log(this.itemsSelecionados)
          }
          else
          {
            this.design.presentToast(
              'Selecione primeiro as conversas',
              'secondary',
              0,
              true
            )
          }
         
   
        }
        else if(dados.data == 'selecionartodos')
        {
          this.selecionarTodos();
        }
        else if(dados.data == 'limpartodos')
        {
          this.limparTodos();
        }
        else if(dados.data == 'finalizar')
        {
          this.finalizarChamadas()
        }
        else
        {
          this.design.presentToast(
            'Função não encontrada',
            'danger',
            0,
            true
          )
        }
      }
    })
    return await popover.present();
  }

  finalizarChamadas()
  {
      if(this.itemsSelecionados.length > 0)
      {
        this.design.presentAlertConfirm(
          'Confirma finalizar chamadas',
          'Você confirma finalizar as chamadas selecionadas ?',
          'Claro!',
          'Nem pensar'
        )
        .then(resConfirm=>{
          if(resConfirm)
          {
            this.itemsSelecionados.forEach(dados=>{
              
            
              this.servConversas.finalizarAtendimento(dados.id,'Finalizacao supervisão',dados.contatoUid,true)
            })
          }
        })
       
      }
      else
      {
        this.design.presentToast(
          'Selecione o atendimento antes de continuar',
          'warning',
          0,
          true
        )
      }
  }

  generateColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
  ngOnInit() {
  }



  marcarItem(elem:any)
  {
   //itemsSelecionados
   let checkConversa = this.itemsSelecionados.reduce( function( cur, val, index ){

        if( val.id === elem.id  && cur === -1 ) {
            return index;
        }
        return cur;

    }, -1 );
    if(checkConversa == -1)
    {
      //ADD
      this.itemsSelecionados.push(elem)
    }
    else
    {
      //REMOVE
      this.itemsSelecionados.splice(checkConversa,1);
    }
  }
 
  processsarTransferencia(usuarioUid:string,usuarioNome:string,supervisao:boolean)
  {
    this.itemsSelecionados.forEach(dados=>{
      console.log('transferindo '+dados.contatoNome)
      this.design.presentLoading('Transferindo '+dados.contatoNome+'...')
      .then(resLoading=>{
        resLoading.present();

        this.servConversas.TransferirConversaEnviar(
          dados.id,
          'Trasferencia supervisão',
          dados.contatoUid,
          usuarioUid,
          usuarioNome,
          supervisao

        )
        .then(res=>{
          console.log(dados.contatoNome  + 'Transferido com sucesso.')
        })
        .catch(err=>{
          console.log('Falha ao trasferir'+dados.contataoNome)
          console.log(err)
        })
        .finally(()=>{
          resLoading.dismiss()
        })

      })
      
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

  async abrirModalTransf(dadosConversa:Conversas)
  {
    const modal = await this.ctrlModal.create({
      component: TransferenciaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        currentUser: this.afa.auth.currentUser,
        conversaUid: dadosConversa.id,
        contatoUid:dadosConversa.contatoUid,
        origemChamada: 'adm'
      }
    });
    await modal.present();
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
          const periodo = {
            dataIni:dados.data.filtro.dataIni,
            dataFim:dados.data.filtro.dataFim
          }
          this.filterData = periodo;
          this.executarFilterCk()
        }
      }
    })
    await modal.present();
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
        if(dados.data.acao == 'filtrar')
        {
          this.filterUser = dados.data.usuarioUid
          this.executarFilterCk();
        }
        if(dados.data.acao == 'transferir')
        {

          
          if(this.itemsSelecionados.length ==  0 || !this.itemsSelecionados)
          {
            this.design.presentToast(
              'Selecione  as chamadas que deseja transferir primeiro.',
              'warning',
              0,
              true
            )
          }
          else
          {
            
            this.design.presentAlertConfirm(
              'Confirmação',
              'Confirma fazer transferencia para '+dados.data.usuarioNome+'?',
              'SIM',
              'Não'
            )
            .then(resConfirm=>{
              if(resConfirm)
              {
                this.processsarTransferencia(dados.data.usuarioUid,dados.data.usuarioNome,true)
              }
            })
           
            
          }
          
        }
      }
    })
    await modal.present();
  }

  async visualizarConversa(dadosConversa:Conversas) {
    const modal = await this.ctrlModal.create({
      component: VisualizarconversaPage,
      cssClass: 'selector-modal',
      componentProps: {
        'dadosConversa': dadosConversa
      }
    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados);
      const action = dados.data.action;
      console.log(action);

      if (action == 'abrirModalTransf') {
        this.abrirModalTransf(dados.data.dadosConversa);
      }

    });

    return await modal.present();
  }

  testa(valor){
    console.log(valor);
  }

  modalTransferencia(dadosConversa:Conversas) {
    try
    {
      if(dadosConversa.slaAgAtendimento)
      {
        this.abrirModalTransf(dadosConversa)
      }
      else
      {
        this.design.presentAlertConfirm(
          'Transferir?',
          'Esta conversa foi assumida por '+dadosConversa.usuarioNome+'. Deseja mesmo transferir?',
          'SIM',
          'Melhor não'

        ).then(resConfir=>{
          if(resConfir)
          {
            this.abrirModalTransf(dadosConversa)
          }
        });
      }
    }
    catch(err)
    {
      console.log(err)
      this.design.presentToast(
        'Falha ao tentar carregar tela ',
        'danger',
        0,
        true
      )
    }
  }

  RoletarAtendimento(dadosConversa:Conversas)
  {
    if(dadosConversa.slaAgAtendimento)
    {
     this.design.presentLoading('Aguarde...')
     .then(resLoading=>{
       resLoading.present();
       this.servConversas.LiberarRoletagem(dadosConversa.id,dadosConversa)
       .then(res=>{
        this.design.presentToast(
          'Conversa redistribuida',
          'success',
          3000
        )
       })
       .catch(err=>{
         console.log(err)
         this.design.presentToast(
           'Falha ao redistribuir chamada',
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
      this.design.presentAlertConfirm(
        'Redistribuir?',
        'Esta conversa foi assumida por '+dadosConversa.usuarioNome+'. Deseja mesmo redistribuir esta chamada?',
        'SIM',
        'Melhor não'

      ).then(resConfir=>{
        if(resConfir)
        {
          alert('confirmado')
        }
      })
    }
  }

  async search(event : string)
  {
    console.log(event);

    if(event == '')
    {
      this.fristLoad();
    }
    else
    {
      this.scrollAuto = false;
      this.conversas = []; 
      this.filtered = [];

      this.servConversas.getFilter(event).forEach(elem=>{
        // if(!elem.empty)
        // {
          elem.docs.forEach(elemdoc=>{
            const id = elemdoc.id;
            const data = elemdoc.data() as Conversas;
            // if (data.situacao == 1 || data.situacao == 2) {
              const dataRetorno =  {id, ... data,elemdoc}
              this.conversas.push(dataRetorno);
            // }
          });
        // }
      });

      console.log(this.conversas);
      this.filtered = this.conversas;
    }
    
  }

  fristLoad()
  {
    
    this.scrollAuto = true;
  
    this.servConversas.getAllAtivas().forEach(dados=>{
      dados.forEach(elem=>{

        this.servConversas.startAfter = elem.doc;

        let checkContato = this.conversas.reduce(( cur, val, index ) => {

          if( val.id === elem.id && cur === -1 ) {
              
            return index;
          }
          return cur;
      
        }, -1 );
        if(checkContato == -1)
        {
          this.conversas.push(elem);
        }
        else
        {
          this.conversas[checkContato] = elem
        }
        
      })
    })

    this.filtered = this.conversas;
  }
}
