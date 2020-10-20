import { CompatendimentocasosfluxoComponent } from './../../componentes/configuracoes/casos/fluxo/compatendimentocasosfluxo/compatendimentocasosfluxo.component';
import { CompatendimentocasosdetalheComponent } from './../../componentes/configuracoes/atendimento/casos/detalhe/compatendimentocasosdetalhe/compatendimentocasosdetalhe.component';
import { CompatendimentocasoshomeComponent } from './../../componentes/configuracoes/atendimento/casos/compatendimentocasoshome/compatendimentocasoshome.component';
import { CompatendimentodepartamentoComponent } from './../../componentes/configuracoes/atendimento/departamento/compatendimentodepartamento/compatendimentodepartamento.component';
import { CompatendimentodetalheComponent } from './../../componentes/configuracoes/atendimento/detalhe/compatendimentodetalhe/compatendimentodetalhe.component';
import { ComplisttransmissaodetalheComponent } from './../../componentes/chat/contatos/listatransmissao/complisttransmissaodetalhe/complisttransmissaodetalhe.component';
import { CompPedidoAddComponent } from './../../componentes/comercial/pedidos/add/comp-pedido-add/comp-pedido-add.component';
import { CompLaraHomeComponent } from './../../componentes/lara/home/comp-lara-home/comp-lara-home.component';
import { CompComercialHomeComponent } from './../../componentes/comercial/home/comp-comercial-home/comp-comercial-home.component';
import { CompFiscalHomeComponent } from './../../componentes/fiscal/home/comp-fiscal-home/comp-fiscal-home.component';
import { CompConfiguracoesHomeComponent } from 'src/app/componentes/configuracoes/home/comp-configuracoes-home/comp-configuracoes-home.component';
import { CompTelegramComponent } from 'src/app/componentes/configuracoes/chat/comp-telegram/comp-telegram.component';
import { CompConfiguracoesAtendimentoHomeComponent } from 'src/app/componentes/configuracoes/atendimento/home/comp-configuracoes-atendimento-home/comp-configuracoes-atendimento-home.component';
import { CompConfiguracoesFinanceiroHomeComponent } from 'src/app/componentes/configuracoes/financeiro/home/comp-configuracoes-financeiro-home/comp-configuracoes-financeiro-home.component';
import { CompConfiguracoesUsuariosHomeComponent } from 'src/app/componentes/configuracoes/usuarios/home/comp-configuracoes-usuarios-home/comp-configuracoes-usuarios-home.component';
import { CompConfiguracoesProdutosHomeComponent } from 'src/app/componentes/configuracoes/produtos/home/comp-configuracoes-produtos-home/comp-configuracoes-produtos-home.component';
import { CompConfiguracoesChatHomeComponent } from 'src/app/componentes/configuracoes/chat/home/comp-configuracoes-chat-home/comp-configuracoes-chat-home.component';
import { CompConfiguracoesUsuariosAddComponent } from 'src/app/componentes/configuracoes/usuarios/add/comp-configuracoes-usuarios-add/comp-configuracoes-usuarios-add.component';
import { CompAprendizadoHomeComponent } from './../../componentes/aprendizado/home/comp-aprendizado-home/comp-aprendizado-home.component';
import { CompAtendimentoHomeComponent } from './../../componentes/atendimento/comp-atendimento-home/comp-atendimento-home.component';
import { CompConsumosHomeComponent } from './../../componentes/consumos/home/comp-consumos-home/comp-consumos-home.component';
import { AddComponent } from './../../componentes/chat/contatos/add/add.component';
import { CompListaAddComponent } from 'src/app/componentes/chat/contatos/comp-lista-add/comp-lista-add.component';
import { CompChatContatosListatransmissaoAddComponent } from 'src/app/componentes/chat/contatos/listatransmissao/add/comp-chat-contatos-listatransmissao-add/comp-chat-contatos-listatransmissao-add.component';
import { CompChatContatosListatransmissaoPerformanceComponent } from 'src/app/componentes/chat/contatos/listatransmissao/performance/comp-chat-contatos-listatransmissao-performance/comp-chat-contatos-listatransmissao-performance.component';
import { CompConfiguracoesChatSmsComponent } from 'src/app/componentes/configuracoes/chat/comp-configuracoes-chat-sms/comp-configuracoes-chat-sms.component';
import { MeusdadosComponent } from 'src/app/componentes/seguranca/meusdados/meusdados.component';

import { ProvEmitterEventService } from './../../provider/prov-emitter-event.service';
import { Teladimanica } from './../../interface/process/teladimanica';

import { ProccessService } from 'src/app/provider/proccess.service';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, ElementRef, HostListener } from '@angular/core';

import { AuthService } from 'src/app/services/seguranca/auth.service';
import { PopoverController, ToastController, Platform, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { UserService } from 'src/app/services/global/user.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { DisplayEventService } from 'src/app/provider/display-event.service';

import { PopoverhomemenuPage } from 'src/app/popover/popoverhomemenu/popoverhomemenu.page';
import { Subscription } from 'rxjs';


//CARREGAMENTO DE COMPONENTES

//CAHT
import { HomeComponent }  from "src/app/componentes/chat/contatos/home/home.component";

//CONVERSAS
import { ConversacontentComponent } from 'src/app/componentes/chat/conversacontent/conversacontent.component';
import { ConversaativalistaComponent } from 'src/app/componentes/chat/conversaativalista/conversaativalista.component';

//FINANCEIROS
import { FinanceiroHomeComponent } from 'src/app/componentes/financeiro/home/home.component';
import { FinanceiroDreComponent } from 'src/app/componentes/financeiro/dre/dre.component';

//ToDo
import { TodohomeComponent } from './../../componentes/todo/todohome/todohome.component';

//MODAl
import { AddPage } from './../chat/contatos/add/add.page';
import { Itnotificacoes } from 'src/app/interface/notificacoes/notificacoes';
import { NotificacoesService } from 'src/app/services/notificacoes/notificacoes.service';
import { AceitePage } from 'src/app/modals/chat/transferencia/aceite/aceite.page';
import { AvisoPage } from 'src/app/modals/notificacoes/aviso/aviso.page';
import { ContatolivrePage } from 'src/app/modals/chat/contatolivre/contatolivre.page';
import { ConsultaPage } from 'src/app/modals/parceiros/consulta/consulta.page';
import { ModalParceiroAddPage } from 'src/app/modals/parceiros/add/add.page';
import { AddGrupoPage } from 'src/app/modals/grupos/add-grupo/add-grupo.page';
import { HomeGrupoPage } from 'src/app/modals/grupos/home-grupo/home-grupo.page';
import { FiltrosPesquisaTransmissaoPage } from 'src/app/modals/lista-transmissao/filtros-pesquisa-transmissao/filtros-pesquisa-transmissao.page';

import { AddTransmissaoPage } from 'src/app/modals/lista-transmissao/add-transmissao/add-transmissao.page';
import { SelectContatosPage } from 'src/app/modals/lista-transmissao/select-contatos/select-contatos.page';

import { NativeAudio } from '@ionic-native/native-audio/ngx';

//ADMINISTRACAO
import { CompAdministracaoHomeComponent } from 'src/app/componentes/administracao/home/comp-administracao-home/comp-administracao-home.component';
import { CompAdministracaoEmpresadetalheComponent } from 'src/app/componentes/administracao/empresadetalhe/comp-administracao-empresadetalhe/comp-administracao-empresadetalhe.component';
import { CompConfiguracoesProdutoAddComponent } from 'src/app/componentes/configuracoes/produtos/add/comp-configuracoes-produto-add/comp-configuracoes-produto-add.component';
import { CompchatrelatoriosComponent } from 'src/app/componentes/chat/relatorios/compchatrelatorios/compchatrelatorios.component';
import { ModalnotificacaoverPage } from 'src/app/modals/notificacoes/modalnotificacaover/modalnotificacaover.page';
import { CompcharellistaComponent } from 'src/app/componentes/chat/relatorios/compchatrellista/compcharellista/compcharellista.component';
import { AcessonegadoPage } from 'src/app/modals/seguranca/acessonegado/acessonegado.page';
import { CompdevlogComponent } from 'src/app/componentes/configuracoes/desenvolvedor/compdevlog/compdevlog.component';
import { CompatendimentorelatoriooperaacoComponent } from 'src/app/componentes/atendimento/relatorios/compatendimentorelatoriooperaaco/compatendimentorelatoriooperaaco.component';
import { CompmssgautomaticaComponent } from 'src/app/componentes/configuracoes/atendimento/msgautomatica/compmssgautomatica/compmssgautomatica.component';
import { CompticketaddComponent } from 'src/app/componentes/ticket/add/compticketadd/compticketadd.component';
import { CompwpptemplateComponent } from 'src/app/componentes/configuracoes/atendimento/whatsapptemplate/compwpptemplate/compwpptemplate.component';
import { TimeoutService } from 'src/app/services/seguranca/timeout.service';
import { ConfigGeralComponent } from 'src/app/componentes/configuracoes/geral/geral.component';
import { GeralService } from 'src/app/services/configuracoes/geral.service';
import { AusentePage } from 'src/app/modals/notificacoes/ausente/ausente.page';


interface Sound {
  key: string;
  asset: string;
  isNative: boolean
}


@Component({
  selector: 'app-homedesk',
  templateUrl: './homedesk.page.html',
  styleUrls: ['./homedesk.page.scss'],
})
export class HomedeskPage implements OnInit {

  private currentUser:any;
  private conversasSubscription: Subscription;
  private autoHide: boolean = false;

  public  notificacoesSubscription: Subscription;
  public  notificacoes = new Array<Itnotificacoes>();
  
  public  onlineSubscription: Subscription;
  private userOnlineId: string = '';

  //AUDIO PLAY
  private forceWebAudio: boolean = true;
  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private notificacoesCarregadas:boolean;
  private modalNotificacoesAberto:boolean = false;
  private timer : any;

  @ViewChild('processContainer', {  read: ViewContainerRef,static:false })  public containerDireito;
  @ViewChild('processContainerEsquerdo', {  read: ViewContainerRef,static:false })  public containerEsquerdo;



  //DETECTAR INATIVIDADE
  public idleTime:number = 0
  public timeOut:number = 0;
  public modalInativo:boolean = false;
  
  @HostListener('mousemove', ['$event'])onMouseDown(event: any) {    this.idleTime = 0 }
  @HostListener('document:keydown', ['$event'])onKeyUp(event: any) { this.idleTime = 0  }
  public timerIncrement(){
    
    //console.log(new Date().getTime()+'| Iniciando contador de inatividade...'+this.timeOut  )
    
    if(!this.modalInativo)
    {
      if(this.idleTime >= this.timeOut)
      {
        this.doInative()
      }
      else
      {
        //console.log('Cont + time ')
        this.idleTime= this.idleTime +1  
      }
    }
    
   
  }
  async doInative(){
    console.warn("INATIVO");
    this.modalInativo = true;
    let modal = await this.Ctrlmodal.create({
      component: AusentePage,
      mode: 'ios',
      showBackdrop: true, 
      cssClass:'selector-modal',
    });

    modal.onDidDismiss().then((dados) => {
      
      if(dados.data !== undefined)
      {
        if(dados.data.acao == 'logout')
        {
          this.authservice.logout()
          .then(resLogout=>{
            console.log('Logout')
          })
          .catch(err=>{
            console.log('Falha ao fazer logout')
          })
        }
      }
      else
      {
        this.modalInativo = false;  
      }
      
      

    })

    await modal.present();
  }
  constructor(
    
    private authservice:AuthService,
  
    private navCtrl:NavigationBar,
    private globalUser:UserService,
    private designProccess:ProcessosService,
    private design:ProcessosService,
    private plataforma : Platform,
    private resolver: ComponentFactoryResolver,
    private eventEmitterService:ProvEmitterEventService,
    private Ctrlmodal:ModalController,
    private notificacoesService:NotificacoesService,
    private nativeAudio: NativeAudio,
    private displayContainers : DisplayEventService,
    private timeout : TimeoutService,
    private configGeral : GeralService
  ) 
  { 
    try
    {
      //set time IdleTime

      this.navCtrl.setUp(this.autoHide)  
      this.globalUser.notificacoesQtd = 0;
      this.notificacoesCarregadas = false;
      this.modalNotificacoesAberto = false;
      
      this.notificacoesSubscription = new Subscription;

       //CARREGAR SOUND BEEP
      if(this.plataforma.is('cordova') && !this.forceWebAudio){

        this.nativeAudio.preloadSimple('beepNotify','src/app/assets/sound/newnotify.mp3')
        .then(ret=>{
          alert('carregou')
          this.nativeAudio.play('beepNotify').then(res2=>{

          })
          .catch(err2=>{
            alert('ruins 1')
          });
        })
        .catch(err=>{
          console.log(err)
          alert('ruins2'+err)
        })
        .finally(()=>{
        })
      }
      else
      {
        let audio = new Audio();
        audio.src = '../../../assets/sound/newnotify.mp3';

        this.sounds.push({
          key: 'beepNotify',
          asset: audio.src,
          isNative: false
        });
      }
    }
    catch(err)
    {
      console.log('NavigateBar not available');
    }
  }

  play(key: string): void {
    if(!this.plataforma.is('hybrid'))
    {
      let soundToPlay = this.sounds.find((sound) => {
        return sound.key === key;
      });

      if(soundToPlay.isNative){
        this.nativeAudio.play(soundToPlay.asset).then((res) => {
          console.log(res);
        }, (err) => {
          console.log(err);
        });
      } 
      else 
      {
        this.audioPlayer.src = soundToPlay.asset;
        this.audioPlayer.play();
      }
    }
    else
    {
      console.log('BEEP desativado');
    }
  }

  ionViewDidEnter() {
    console.log('Inicializações de tela');

    this.authservice.getCUrrentUser()
    .then(dados=>{
      this.globalUser.dadosLogado = dados;
      this.currentUser = dados;
      console.log(dados);

      //CARREGAR NOTIFICACOES
      let liberarBeep = false;
      this.notificacoesService.getNotificacoes().subscribe(dados=>{
        if(dados.length > 0)
        {
          console.log('Existem notificacoes')
          dados.forEach(elem=>{
            let checkNotificacao = this.globalUser.notificacoes.reduce( function( cur, val, index ){
                if( val.id === elem.id && cur === -1 ) {
                  return index;
                }
                return cur;
            }, -1 );
            if(checkNotificacao == -1)
            {
              //NAO EXISTE
              this.globalUser.notificacoes.push(elem);
              liberarBeep = true;
            }
          })
          if(liberarBeep)
          {
            this.modalNewNotificacao(this.globalUser.notificacoes)
          }
          this.globalUser.notificacoesQtd = this.globalUser.notificacoes.length
        }
      })

      //SETAR CANAL DE NOTIFICACAO
      this.notificacoesSubscription = this.notificacoesService.getAll(dados.idCliente).subscribe(data=>{     
        this.notificacoes = data;
        data.forEach(item => {
          if(!item.finalizado) {
            this.play('beepNotify')
            if(item.tipo === 'transferencia') {
              
              this.modalTransferenciaAceite(item);
            } else if (item.tipo === 'contatolivre') {
              this.modalContatoLivre(item);
            } else {
              //REJEICAO COLOCADA AQUI 
              //alert(item.tipo)
              this.modalNotificacao(item);
            }
          }
        });
      });

      this.abrirComponente('E','conversasativas',{});
      this.abrirComponente('D','toDo',{});
    })
  }

  async modalNotificacao(notificacaoData:Itnotificacoes) {
    const modal = await this.Ctrlmodal.create({
      component: AvisoPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        currentUser: this.currentUser,
        notificacaoData: notificacaoData
      }
    });
    await modal.present();
  }

  async modalTransferenciaAceite(notificacaoDataRec:Itnotificacoes) {
    console.log('Abrindo dados de transferencia');

    const modal = await this.Ctrlmodal.create({
      component: AceitePage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        currentUser: this.currentUser,
        notificacaoData: notificacaoDataRec
      }
    });
    await modal.present();
  }

  async modalContatoLivre(notificacaoData:Itnotificacoes) {
    const modal = await this.Ctrlmodal.create({
      component: ContatolivrePage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        currentUser: this.currentUser,
        notificacaoData: notificacaoData
      }
    });
    await modal.present();
  }

  private resolveComponentsName(componentName) {
    console.log('Resolvendo '+componentName);

    if (componentName === 'abrirmensagems' || componentName === 'chatConversaOpen') {
      return ConversacontentComponent;
    }
    else if(componentName === 'compatendimentorelatoriooperaaco')
    {
      return CompatendimentorelatoriooperaacoComponent
    }
    else if(componentName ==='falarLara' )
    {
      return CompLaraHomeComponent
    }
    else if(componentName ==='conversasativas')
    {
      return ConversaativalistaComponent;
    }
    else if(componentName ==='financeiroHome')
    {
      return FinanceiroHomeComponent;
    }
    else if(componentName ==='financeiroDre')
    {
      return FinanceiroDreComponent;
    }
    else if(componentName ==='toDo')
    {
      return TodohomeComponent;
    }
    else if(componentName === 'chatContatoHome')
    {
      return HomeComponent
    }
    else if(componentName === 'compAtendimentoHome')
    {
      return CompAtendimentoHomeComponent
    }
    else if(componentName === 'compAprendizadoHome')
    {
      return CompAprendizadoHomeComponent
    }
    else if(componentName ==='compFiscalHome')
    {
      return CompFiscalHomeComponent
    }
    else if(componentName === 'compConsumosHome')
    {
      return CompConsumosHomeComponent
    }
    else if(componentName === 'compComercialHome')
    {
      return CompComercialHomeComponent
    }
    else if(componentName === 'compContatoAdd')
    {
      return AddComponent
    }
    else if(componentName === 'compListaAdd')
    {
      return CompListaAddComponent
    }
    else if(componentName === 'compConfiguracoesHome')
    {
      return CompConfiguracoesHomeComponent;
    }
    else if(componentName === 'compConfiguracoesTelegram')
    {
      return CompTelegramComponent;
    }
    else if(componentName === 'compConfiguracoesFinanceiroHome')
    {
      return CompConfiguracoesFinanceiroHomeComponent;
    }
    else if(componentName === 'compConfiguracoesUsuariosHome')
    {
      return CompConfiguracoesUsuariosHomeComponent;
    }
    else if(componentName === 'compConfiguracoesProdutosHome')
    {
      return CompConfiguracoesProdutosHomeComponent;
    }
    else if(componentName === 'compConfiguracoesChatHome')
    {
      return CompConfiguracoesChatHomeComponent;
    }
    else if (componentName === 'compmssgautomatica')
    {
      return CompmssgautomaticaComponent
    }
    else if(componentName === 'compConfiguracoesUsuariosAdd')
    {
      return CompConfiguracoesUsuariosAddComponent;
    }
    else if(componentName === 'compConfiguracoesAtendimentoHome')
    {
      return CompConfiguracoesAtendimentoHomeComponent;
    }
    else if(componentName === 'CompPedidoAdd')
    {
      return CompPedidoAddComponent;
    }
    else if(componentName === 'ListatransmissaoAddComponent')
    {
      return CompChatContatosListatransmissaoAddComponent;
    }
    else if(componentName === 'ListatransmissaoPerformanceComponent')
    {
      return CompChatContatosListatransmissaoPerformanceComponent;
    }
    else if(componentName === 'CompConfiguracoesChatSmsComponent')
    {
      return CompConfiguracoesChatSmsComponent;
    }

    else if(componentName === 'compMeusDados')
    {
      return MeusdadosComponent;
    }
    else if(componentName === 'CompAdministracaoHomeComponent')
    {
      return CompAdministracaoHomeComponent;
    }
    else if(componentName === 'CompAdministracaoEmpresadetalheComponent')
    {
      return CompAdministracaoEmpresadetalheComponent;

    }
    else if(componentName === 'CompConfiguracoesProdutoAddComponent')
    {
      return CompConfiguracoesProdutoAddComponent
    }
    else if(componentName === 'CompchatrelatoriosComponent')
    {
      return CompchatrelatoriosComponent
    }
    else if(componentName === 'complisttransmissaodetalhe')
    {
      return ComplisttransmissaodetalheComponent
    }
    else if(componentName === 'compatendimentodetalhe')
    {
      return CompatendimentodetalheComponent
    }
    else if(componentName === 'compatendimentodepartamento')
    {
      return CompatendimentodepartamentoComponent
    }
    else if(componentName === 'compatendimentocasoshome')
    {
      return CompatendimentocasoshomeComponent
    }
    else if(componentName === 'compatendimentocasosdetalhe')
    {
      return CompatendimentocasosdetalheComponent
    }
    else if(componentName === 'compatendimentocasosfluxo')
    {
      return CompatendimentocasosfluxoComponent
    }
    else if(componentName === 'compdevlog')
    {
      return CompdevlogComponent 
    }
    else if(componentName === 'compConfigGeral')
    {
      return ConfigGeralComponent
    }
    else if(componentName === 'compcharellista')
    {
      return CompcharellistaComponent
    }
    else if (componentName === 'compticketadd')
    {
      console.log('Detectado componente')
      return CompticketaddComponent
    }
    else if(componentName === 'compwpptemplate')
    {
      return CompwpptemplateComponent
    }
    else
    {
      alert('error')
      return false;
    }
  }
  
  async InformarAcessoNegado(permissoes:any,componenteNome:string) {
    const modal = await  this.Ctrlmodal.create({
      component: AcessonegadoPage,
      cssClass:'selector-modal',
      componentProps: {
        permissoes,
        componenteNome
      }
    });
    return await modal.present();
  }
  abrirComponente(container:string,componentName:string,data?:any): Promise<Boolean> {

    return new Promise((resolve, reject) => {
      //MODASL
      if(
        componentName == 'btnBack' ||
        componentName == 'chatContatoEdit' ||
        componentName == 'modalContatoSelectGrupo' ||
        componentName == 'modalContatoAddParceiros' ||
        componentName == 'modalContatoViewParceiros'
        )
      {
        if(componentName == 'btnBack' )
        {
          this.btnBack(data.componente);
        }
        if(componentName == 'chatContatoEdit' )
        {
          this.contatoAbrir(data.contatoUid);
        }
        if(componentName == 'modalContatoSelectGrupo' )
        {
          this.contatoSelectGrupo(data);
        }
        if(componentName == 'modalContatoAddParceiros' )
        {
          this.parceiroAdd(data);
        }
        if(componentName == 'modalContatoViewParceiros' )
        {
          this.parceiroConsulta(data);
        }
      }
      else
      {
        this.authservice.checkPermissao(componentName)
        .then(()=>{
        
          //DEU CERTO O CARREGAMENTO
          this.design.presentLoading('Carregando...')
          .then(respLoading=>{
            respLoading.present();

            try
            {
              let comp = this.resolveComponentsName(componentName);
        
              if(comp!= false)
              {
                
                console.log('Componente identificado '+componentName);
                let newItem = new ProccessService(comp, data);
                const factory = this.resolver.resolveComponentFactory(newItem.component);

                //Criar o componente 
                if(container == 'D')
                {
                  this.containerDireito.clear();
                  console.log('Carregando container D')
                  let componentRef = this.containerDireito.createComponent(factory);

            
                  (<Teladimanica>componentRef.instance).data = newItem.desc;

                  
                }
                else if(container == 'E')
                {
                  console.log('Carregando container E')

                  this.containerEsquerdo.clear();
                
                  let componentRef = this.containerEsquerdo.createComponent(factory);
            
                  (<Teladimanica>componentRef.instance).data = newItem.desc;


                }
                else
                {
                  console.log('Não existe um container ativo ('+container+')   ');
                }
              
                respLoading.dismiss();
                resolve(true)
              
              }
              else
              {
                alert('Falha ao carregar '+componentName)
                console.log('Componente nào esta instanciado');
                reject(false)
              }

            }
            catch(err)
            {
              reject(false)
              console.log(err);
              respLoading.dismiss();
              this.design.presentToast(
                'Falha ao carregar tela',
                'danger',
                4000
              )
            }

          })
          .catch(err=>{

          })
          .finally(()=>{
          
          })
        })
        .catch(err=>{
          this.InformarAcessoNegado(err.permissoesNivel,componentName)
        })
      }

      


      


    })

      

      

   
     
    
  
  }


  ngOnInit() {

    

    this.onlineSubscription = this.authservice.getOnline().subscribe(data => {
      console.log(data);
      this.userOnlineId = data[0].id;
      if(!data[0].conectado) {
        this.design.presentToast(
          'Foi detectado um novo login com o seu usuário',
          'secondary',
          0,
          true
        )
        //this.authservice.logout();
      }
    });
    console.log('On Emitter');
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeFirstComponentFunction.subscribe((param:any) => {  
        let data = param.data;

        //ABRIR COMPONENTE
        this.abrirComponente('D',param.function ,data)
        .catch((err)=>{
          console.log(err)
          this.design.presentToast(
            'Houve um problema ao processar sua solicitaç±ao. Tente novamente mais tarde',
            'danger',
            0,
            true
          )
        })


      });    
    }  

    console.log(this.globalUser);
    try {
      this.authservice.getCUrrentUser()
      .then(dados=>{
        this.currentUser = dados;


        if(this.globalUser.dadosLogado.confSeguranca !== undefined)
        {

          this.timeOut = Number( this.globalUser.dadosLogado.confSeguranca.timeout)
        
          if(this.timeOut > 0 )
          {
          
            const idleInterval = setInterval(function(){this.timerIncrement()}.bind(this),60000) //1 minuto intervalo
          }
        
        }



      })
      .catch(err=>{
        console.log('Erro ao carregar dados de usuarioa corrente')
      })
    } 
    catch (error) {
      console.log('Fatal error ');
      this.authservice.logout()
      .then(()=>{
        this.designProccess.presentToast(
          ' Houve um erro grave tente acessar novamente mais tarde ou desinstale o APP e instale novamente',
          'danger',
          5000
        );
      })
      .catch(()=>{

      }) 
    }
    //this.timeout.loadTimeoutSettings()
    //this.timeout.start('');
   
  }

  //FUNCAO DE INATIVIDADE 
 
  ngOnDestroy(){
    console.log('Destroy itens empresa')
    this.timeout.close();
    this.globalUser.dadosLogado = null//{uid:'',idCliente:'',nome:'',empresa:'',photo:''};
    this.conversasSubscription.unsubscribe();
    this.notificacoesSubscription.unsubscribe();

    this.authservice.deleteOnline(this.userOnlineId);
    this.onlineSubscription.unsubscribe();
  }

  popoverfechar()
  {
    
    
  }
  


  //ACOES DE BOTOES
  btnBack(componente:string)
  {
    console.log('clicked back');
    if(componente == 'home')
    {
      console.log('back success');
      this.abrirComponente('D','toDo',{});
    }
    else
    {
      console.log('Componente indefinido '+componente);
      this.designProccess.presentToast(
        'Falha ao retornar tela',
        'danger',
        4000
      )
    }
  }

  async contatoAbrir(contatoUid:string) {
    console.log('modal->'+contatoUid)
    const modal = await this.Ctrlmodal.create({
      component: AddPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        contatoUid
      }
    });
    await modal.present();
  }

  async parceiroConsulta(contatoId:string) {
    console.log('modal->'+contatoId)
    const modal = await this.Ctrlmodal.create({
      component: ConsultaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        contatoId
      }
    });
    await modal.present();
  }

  async parceiroAdd(parceiroId:string) {
    console.log('modal Parceiro Add->'+parceiroId)
    // this.Ctrlmodal.dismiss();

    const modal = await this.Ctrlmodal.create({
      component: ModalParceiroAddPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        parceiroId
      }
    });
    await modal.present();
  }

  async listaTransmissaoDados(transmissaoId:string) {
    console.log('modal Parceiro Add->'+transmissaoId)
    // this.Ctrlmodal.dismiss();

    const modal = await this.Ctrlmodal.create({
      component: AddTransmissaoPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        transmissaoId
      }
    });
    await modal.present();
  }

  async listaTransmissaoSelectContatos(transmissaoId:string) {
    console.log('modal Parceiro Add->'+transmissaoId);

    const modal = await this.Ctrlmodal.create({
      component: SelectContatosPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        transmissaoId
      }
    });
    await modal.present();
  }

  async contatoSelectGrupo(contatoId:string) {
    const modal = await this.Ctrlmodal.create({
      component: HomeGrupoPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        contatoId
      }
    });
    await modal.present();
  }

  async listaTransmissaoFiltros(transmissaoId : string) {
    const modal = await this.Ctrlmodal.create({
      component: FiltrosPesquisaTransmissaoPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        transmissaoId
      }
    });
    await modal.present();
  }

  async modalNewNotificacao(dados:any) {

    console.log('Verfiicar modal aberta')

    if(!this.modalNotificacoesAberto)
    {
      console.log('Abrir')
      this.modalNotificacoesAberto = true;
      this.play('beepNotify')
      const modal = await this.Ctrlmodal.create({
        component: ModalnotificacaoverPage,
        mode: 'ios',
        showBackdrop: true,
        cssClass:'selector-modal',
        componentProps: {
         dados
        }
      });
      modal.onDidDismiss().then((dados) => {
        this.modalNotificacoesAberto = false;
        
      })
  
      await modal.present();

    }
    else
    {
      console.log('ja aberta')
    }
   
  }

  

  public chatConversaOpen(conversaUid:string,contatoUid:string)
  {
    this.abrirComponente('D','abrirmensagems',{conversaUid,contatoUid});
  
  }
  
}


