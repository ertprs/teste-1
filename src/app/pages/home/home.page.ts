import { CompatendimentocasosfluxoComponent } from './../../componentes/configuracoes/casos/fluxo/compatendimentocasosfluxo/compatendimentocasosfluxo.component';
import { CompatendimentocasosdetalheComponent } from './../../componentes/configuracoes/atendimento/casos/detalhe/compatendimentocasosdetalhe/compatendimentocasosdetalhe.component';
import { CompatendimentocasoshomeComponent } from './../../componentes/configuracoes/atendimento/casos/compatendimentocasoshome/compatendimentocasoshome.component';
import { CompatendimentodepartamentoComponent } from './../../componentes/configuracoes/atendimento/departamento/compatendimentodepartamento/compatendimentodepartamento.component';
import { CompatendimentodetalheComponent } from './../../componentes/configuracoes/atendimento/detalhe/compatendimentodetalhe/compatendimentodetalhe.component';
import { ComplisttransmissaodetalheComponent } from './../../componentes/chat/contatos/listatransmissao/complisttransmissaodetalhe/complisttransmissaodetalhe.component';
import { CompPedidoAddComponent } from './../../componentes/comercial/pedidos/add/comp-pedido-add/comp-pedido-add.component';
import { CompLaraHomeComponent } from './../../componentes/lara/home/comp-lara-home/comp-lara-home.component';
import { CompAtendimentoHomeComponent } from './../../componentes/atendimento/comp-atendimento-home/comp-atendimento-home.component';
import { CompConfiguracoesHomeComponent } from 'src/app/componentes/configuracoes/home/comp-configuracoes-home/comp-configuracoes-home.component';
import { CompConfiguracoesAtendimentoHomeComponent } from 'src/app/componentes/configuracoes/atendimento/home/comp-configuracoes-atendimento-home/comp-configuracoes-atendimento-home.component';
import { CompConfiguracoesFinanceiroHomeComponent } from 'src/app/componentes/configuracoes/financeiro/home/comp-configuracoes-financeiro-home/comp-configuracoes-financeiro-home.component';
import { CompConfiguracoesUsuariosHomeComponent } from 'src/app/componentes/configuracoes/usuarios/home/comp-configuracoes-usuarios-home/comp-configuracoes-usuarios-home.component';
import { CompConfiguracoesProdutosHomeComponent } from 'src/app/componentes/configuracoes/produtos/home/comp-configuracoes-produtos-home/comp-configuracoes-produtos-home.component';
import { CompConfiguracoesChatHomeComponent } from 'src/app/componentes/configuracoes/chat/home/comp-configuracoes-chat-home/comp-configuracoes-chat-home.component';
import { CompConfiguracoesUsuariosAddComponent } from 'src/app/componentes/configuracoes/usuarios/add/comp-configuracoes-usuarios-add/comp-configuracoes-usuarios-add.component';
import { CompChatContatosListatransmissaoAddComponent } from 'src/app/componentes/chat/contatos/listatransmissao/add/comp-chat-contatos-listatransmissao-add/comp-chat-contatos-listatransmissao-add.component';
import { CompChatContatosListatransmissaoPerformanceComponent } from 'src/app/componentes/chat/contatos/listatransmissao/performance/comp-chat-contatos-listatransmissao-performance/comp-chat-contatos-listatransmissao-performance.component';
import { CompConfiguracoesChatSmsComponent } from 'src/app/componentes/configuracoes/chat/comp-configuracoes-chat-sms/comp-configuracoes-chat-sms.component';
import { MeusdadosComponent } from 'src/app/componentes/seguranca/meusdados/meusdados.component';

import { ProccessService } from 'src/app/provider/proccess.service';


import { UserService } from './../../services/global/user.service';
import { Router } from '@angular/router';


import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { AnalyticsService } from 'src/app/services/google/analytics.service';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { PopoverController, Platform, ToastController, ModalController } from '@ionic/angular';

import { NavigationBar } from '@ionic-native/navigation-bar/ngx';

import { PopoverhomemenuPage } from './../../popover/popoverhomemenu/popoverhomemenu.page';
import { Itseguserlogado } from 'src/app/interface/seguranca/itseguserlogado';
import { ProcessosService } from 'src/app/services/design/processos.service';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Itempresaativa } from 'src/app/interface/seguranca/itempresaativa';
import { map } from 'rxjs/operators';
import { Conversas } from 'src/app/interface/chat/conversas';
import { ConversasService } from './../../services/chat/conversas.service';
import { Dialogs } from '@ionic-native/dialogs/ngx';

import { TransferenciaPage } from 'src/app/modals/chat/transferencia/transferencia.page';

import { NotificacoesService } from 'src/app/services/notificacoes/notificacoes.service';
import { Itnotificacoes } from 'src/app/interface/notificacoes/notificacoes';

import { AceitePage } from 'src/app/modals/chat/transferencia/aceite/aceite.page';
import { AvisoPage } from 'src/app/modals/notificacoes/aviso/aviso.page';

//PUSH MESSEGE
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from '@capacitor/core';
import { PushnotificationService } from 'src/app/services/seguranca/pushnotification.service';
import { Itpushnotification } from 'src/app/interface/seguranca/itpushnotification';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Teladimanica } from 'src/app/interface/process/teladimanica';
import { ConversacontentComponent } from 'src/app/componentes/chat/conversacontent/conversacontent.component';
import { ConversaativalistaComponent } from 'src/app/componentes/chat/conversaativalista/conversaativalista.component';
import { FinanceiroHomeComponent } from 'src/app/componentes/financeiro/home/home.component';
import { FinanceiroDreComponent } from 'src/app/componentes/financeiro/dre/dre.component';

import { AddPage } from '../chat/contatos/add/add.page';
import { TodohomeComponent } from 'src/app/componentes/todo/todohome/todohome.component';
import { HomeComponent } from 'src/app/componentes/chat/contatos/home/home.component';
import { CompAprendizadoHomeComponent } from 'src/app/componentes/aprendizado/home/comp-aprendizado-home/comp-aprendizado-home.component';
import { CompFiscalHomeComponent } from 'src/app/componentes/fiscal/home/comp-fiscal-home/comp-fiscal-home.component';
import { CompConsumosHomeComponent } from 'src/app/componentes/consumos/home/comp-consumos-home/comp-consumos-home.component';
import { AddComponent } from 'src/app/componentes/chat/contatos/add/add.component';
import { CompListaAddComponent } from 'src/app/componentes/chat/contatos/comp-lista-add/comp-lista-add.component';
import { CompComercialHomeComponent } from 'src/app/componentes/comercial/home/comp-comercial-home/comp-comercial-home.component';

//MODAL
import { ContatolivrePage } from 'src/app/modals/chat/contatolivre/contatolivre.page';
import { ConsultaPage } from 'src/app/modals/parceiros/consulta/consulta.page';
import { ModalParceiroAddPage } from 'src/app/modals/parceiros/add/add.page';
import { CompTelegramComponent } from 'src/app/componentes/configuracoes/chat/comp-telegram/comp-telegram.component';
import { HomeGrupoPage } from 'src/app/modals/grupos/home-grupo/home-grupo.page';
import { FiltrosPesquisaTransmissaoPage } from 'src/app/modals/lista-transmissao/filtros-pesquisa-transmissao/filtros-pesquisa-transmissao.page';

//ADMINISTRACAO
import { CompAdministracaoHomeComponent } from 'src/app/componentes/administracao/home/comp-administracao-home/comp-administracao-home.component';
import { CompAdministracaoEmpresadetalheComponent } from 'src/app/componentes/administracao/empresadetalhe/comp-administracao-empresadetalhe/comp-administracao-empresadetalhe.component';
import { CompConfiguracoesProdutoAddComponent } from 'src/app/componentes/configuracoes/produtos/add/comp-configuracoes-produto-add/comp-configuracoes-produto-add.component';
import { CompchatrelatoriosComponent } from 'src/app/componentes/chat/relatorios/compchatrelatorios/compchatrelatorios.component';

const { PushNotifications } = Plugins;
const { LocalNotifications } = Plugins;

import { FCM } from '@capacitor-community/fcm';
import { ConfigGeralComponent } from 'src/app/componentes/configuracoes/geral/geral.component';
const fcm = new FCM();

//
// alternatively - without types
const { FCMPlugin } = Plugins;


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  public qtdCanais:number = 0;
  public canaisChecados:boolean = false;
  private autoHide: boolean = false;
  private currentUser:any;
  private interfaceNotification = new Array<Itpushnotification>();
  public conversas = new Array<Conversas>();
  public queryText : string = '';
  public filtered:any[] = [];
  
  private conversasSubscription: Subscription;

  private notificacoesSubscription: Subscription;
  private notificacoes = new Array<Itnotificacoes>();

  public  onlineSubscription: Subscription;
  private userOnlineId: string = '';

  @ViewChild('processContainer', {  read: ViewContainerRef,static:false })  public container;

  
  constructor(
    private googleAnalytics:AnalyticsService,
    private authservice:AuthService,
    private popoverController: PopoverController,
    private router:Router,
    private navCtrl:NavigationBar,
    private globalUser:UserService,
    private designProccess:ProcessosService,
    private afs: AngularFirestore,
    private conversasService:ConversasService,
    private servicePushNotification:PushnotificationService,
    public toastController: ToastController,
    private alertsDialogs: Dialogs,
    private plataforma : Platform,
    private modal:ModalController,
    private notificacoesService:NotificacoesService,
    private eventEmitterService:ProvEmitterEventService,
    private resolver: ComponentFactoryResolver,
  ) 
  { 
    this.navCtrl.setUp(this.autoHide)  
  }

  ionViewDidEnter() {
    console.log('Inicializações de tela');

    this.plataforma.backButton.subscribeWithPriority(9999, () => {
        
      document.addEventListener('backbutton', function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('back stoped 2 ');
        try
        {
          this.btnBack('home')
        }
        catch(err)
        {
          console.log('Falha ao executar back');
          console.log(err);
        }
        

      
  

      }, false);
    })


    this.authservice.getCUrrentUser()
    .then(dados=>{
      console.log('Dados de usuuario setados ');
      this.globalUser.dadosLogado = dados;
      this.currentUser = dados;

      this.abrirComponente('conversasativas',{});


      this.notificacoesSubscription = this.notificacoesService.getAll(this.currentUser.idCliente).subscribe(data=>{     
        this.notificacoes = data;
        data.forEach(item => {
          if(!item.finalizado) {
            if(item.tipo === 'transferencia') {
              this.modalTransferenciaAceite(item);
            } else if (item.tipo === 'contatolivre') {
              this.modalContatoLivre(item);
            } else {
              this.modalNotificacao(item);
            }
          }
        });
      })
    })
  }
  private resolveComponentsName(componentName) {
    if (componentName === 'abrirmensagems') {
      return ConversacontentComponent;
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
    else if(componentName == 'chatContatoHome')
    {
      return HomeComponent
    }
    else if(componentName == 'compAtendimentoHome')
    {
      return CompAtendimentoHomeComponent
    }
    else if(componentName == 'compAprendizadoHome')
    {
      return CompAprendizadoHomeComponent
    }
    else if(componentName == 'compFiscalHome')
    {
      return CompFiscalHomeComponent
    }
    else if(componentName == 'compConsumosHome')
    {
      return CompConsumosHomeComponent
    }
    else if(componentName == 'compComercialHome')
    {
      return CompComercialHomeComponent
    }
    else if(componentName == "falarLara")
    {
      return CompLaraHomeComponent
    }
    else if(componentName == 'compContatoAdd')
    {
      return AddComponent
    }
    else if(componentName == 'compListaAdd')
    {
      return CompListaAddComponent
    }
    else if(componentName == 'compConfiguracoesHome')
    {
      return CompConfiguracoesHomeComponent;
    }
    else if(componentName === 'compConfigGeral')
    {
      return ConfigGeralComponent;
    }
    else if(componentName == 'compConfiguracoesTelegram')
    {
      return CompTelegramComponent;
    }
    else if(componentName == 'compConfiguracoesFinanceiroHome')
    {
      return CompConfiguracoesFinanceiroHomeComponent;
    }
    else if(componentName == 'compConfiguracoesUsuariosHome')
    {
      return CompConfiguracoesUsuariosHomeComponent;
    }
    else if(componentName == 'compConfiguracoesProdutosHome')
    {
      return CompConfiguracoesProdutosHomeComponent;
    }
    else if(componentName == 'compConfiguracoesChatHome')
    {
      return CompConfiguracoesChatHomeComponent;
    }
    else if(componentName == 'compConfiguracoesUsuariosAdd')
    {
      return CompConfiguracoesUsuariosAddComponent;
    }
    else if(componentName == 'compConfiguracoesAtendimentoHome')
    {
      return CompConfiguracoesAtendimentoHomeComponent;
    }
    else if(componentName == 'CompPedidoAdd')
    {
      return CompPedidoAddComponent;
    }
    else if(componentName == 'ListatransmissaoAddComponent')
    {
      return CompChatContatosListatransmissaoAddComponent;
    }  
    else if(componentName == 'ListatransmissaoPerformanceComponent')
    {
      return CompChatContatosListatransmissaoPerformanceComponent;
    }
    else if(componentName == 'CompConfiguracoesChatSmsComponent')
    {
      return CompConfiguracoesChatSmsComponent;
    }

    else if(componentName == 'compMeusDados')
    {
      return MeusdadosComponent;
    }
    else if(componentName == 'CompAdministracaoHomeComponent')
    {
      return CompAdministracaoHomeComponent;
    }
    else if(componentName == 'CompAdministracaoEmpresadetalheComponent')
    {
      return CompAdministracaoEmpresadetalheComponent;

    }
    else if(componentName == 'CompConfiguracoesProdutoAddComponent')
    {
      return CompConfiguracoesProdutoAddComponent;

    }
    else if(componentName == 'CompchatrelatoriosComponent')
    {
      return CompchatrelatoriosComponent
    }
    else if(componentName == 'complisttransmissaodetalhe')
    {
      return ComplisttransmissaodetalheComponent
    }
    else if(componentName == 'compatendimentodetalhe')
    {
      return CompatendimentodetalheComponent
    }
    else if(componentName == 'compatendimentodepartamento')
    {
      return CompatendimentodepartamentoComponent
    }
    else if(componentName == 'compatendimentocasoshome')
    {
      return CompatendimentocasoshomeComponent
    }
    else if(componentName == 'compatendimentocasosdetalhe')
    {
      return CompatendimentocasosdetalheComponent
    }
    else if(componentName == 'compatendimentocasosfluxo')
    {
      return CompatendimentocasosfluxoComponent
    }
    else
    {
      return false;
    }
  }
  
  ngOnDestroy() {
    console.log('Home destroy')
    this.eventEmitterService.invokeFirstComponentFunction.unsubscribe();
    this.authservice.deleteOnline(this.userOnlineId);
    this.onlineSubscription.unsubscribe();
  }
  abrirComponente(componentName:string,data?:any){
   
      this.designProccess.presentLoading('Carregando...')
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
            this.container.clear();
            console.log('Carregando container')
            let componentRef = this.container.createComponent(factory);
            (<Teladimanica>componentRef.instance).data = newItem.desc;
            respLoading.dismiss();
          }
          else
          {
            respLoading.dismiss();
            console.log('Componentenào esta instanciado '+componentName);
            this.designProccess.presentToast(
              'Falha ao carregar tela',
              'danger',
              4000
            )
          }

        }
        catch(err)
        {
          console.log(err);
          respLoading.dismiss();
          this.designProccess.presentToast(
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
  }





  ngOnInit() {
    try
    {
      this.onlineSubscription = this.authservice.getOnline().subscribe(data => {
        console.log(data);
        this.userOnlineId = data[0].id;
        if(!data[0].conectado) {
          this.designProccess.presentToast(
            'Foi detectado um novo login com o seu usuário',
            'secondary',
            0,
            true
          )
          //this.authservice.logout();
        }
      });
      this.authservice.getCUrrentUser()
      .then(res=>{
        console.log('On Emitter');
        if (this.eventEmitterService.subsVar==undefined) {  
          
          this.eventEmitterService.subsVar = this.eventEmitterService.    
          invokeFirstComponentFunction.subscribe((param:any) => {  
            let data = param.data;
            if(param.function == 'chatConversaOpen')
            {
              this.chatConversaOpen(data.conversaUid,data.contatoUid);  
            }
            else if(param.function == 'falarLara')
            {
              this.abrirComponente(param.function,data);
            }
            else if(param.function == 'chatContatoHome')
            {
              this.abrirComponente(param.function,data);
            }
            else if(param.function == 'chatContatoEdit')
            {
              console.log('Abrir contato '+data.contatoUid);
              this.contatoAbrir(data.contatoUid);
            }
            else if(param.function == 'btnBack')
            {
              this.btnBack(data.componente);
            }
            else if(param.function == 'financeiroOpen')
            {
              this.abrirComponente('financeiroHome',data);
            }
            else if(param.function == 'financeiroDreOpen')
            {
              this.abrirComponente('financeiroDre',data);
            }
            else if(param.function == 'toDo')
            {
              this.abrirComponente('toDo',data);
            }
            else if(param.function == 'compAtendimentoHome')
            {
              this.abrirComponente(param.function,data);
            }
            else if(param.function == 'compAprendizadoHome')
            {
              this.abrirComponente(param.function,data);
            }
            else if(param.function == 'compFiscalHome')
            {
              this.abrirComponente(param.function,data);
            }
            else if(param.function == 'compConsumosHome')
            {
              this.abrirComponente(param.function,data);
            }
            else if(param.function == 'compComercialHome')
            {
              this.abrirComponente(param.function,data);
            }
            else if(param.function == 'compContatoAdd')
            {
              this.abrirComponente(param.function,data);
            }
            else if(param.function == 'compListaAdd')
            {
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'modalContatoViewParceiros')
            {
              this.parceiroConsulta(data);
            }
            else if(param.function == 'modalContatoAddParceiros')
            {
              this.parceiroAdd(data);
            }
            else if(param.function == 'modalContatoSelectGrupo')
            {
              this.contatoSelectGrupo(data);
            }
            else if(param.function == 'modalFiltrosPesquisaTransmissao')
            {
              this.listaTransmissaoFiltros(data);
            }
            else if(param.function == 'compConfiguracoesHome')
            {
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'compConfiguracoesTelegram')
            {
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'compConfiguracoesFinanceiroHome')
            {
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'compConfiguracoesUsuariosHome')
            {
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'compConfiguracoesProdutosHome')
            {
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'compConfiguracoesChatHome')
            {
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'compConfiguracoesUsuariosAdd')
            {
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'compConfiguracoesAtendimentoHome')
            {
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'CompPedidoAdd'){
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'ListatransmissaoAddComponent'){
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'ListatransmissaoPerformanceComponent'){
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'CompConfiguracoesChatSmsComponent'){
              this.abrirComponente(param.function ,data);
            }

            else if(param.function == 'compMeusDados'){
              this.abrirComponente(param.function ,data);
            }               

            else if(param.function == 'CompAdministracaoHomeComponent'){
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'CompAdministracaoEmpresadetalheComponent'){
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'CompConfiguracoesProdutoAddComponent'){
              this.abrirComponente(param.function ,data);
            }
            else if(param.function == 'CompchatrelatoriosComponent')
            {
              this.abrirComponente(param.function,data)
            }
            else if(param.function == 'complisttransmissaodetalhe'){
              this.abrirComponente(param.function,data)
            }
            else if (param.function == 'compatendimentodetalhe')
            {
              this.abrirComponente(param.function,data)
            }
            else if (param.function = 'compatendimentodepartamento')
            {
              this.abrirComponente(param.function,data)
            }
            else if(param.function == 'compatendimentocasoshome')
            {
              this.abrirComponente(param.function,data)
            }
            else if(param.function == 'compatendimentocasosdetalhe')
            {
              this.abrirComponente(param.function,data)
            }
            else if(param.function == 'compatendimentocasosfluxo')
            {
              this.abrirComponente(param.function,data)
            }
            else
            {
              console.log('Função não definida');
              this.designProccess.presentToast(
                'Falha ao carregar tela',
                'danger',
                4000
              )
            }
            
          });    
        }  
        //Recuperar dados de usuario logado 
        console.log('Initializing HomePage');
        if(this.plataforma.is('hybrid'))
        {
          //CARREGAR APENAS NO MOBILE
          //PUSH NOTIFICATION 
          // Request permission to use push notifications
          // iOS will prompt user and return if they granted permission or not
          // Android will just grant without prompting
          PushNotifications.requestPermission().then( result => {
            if (result.granted) {

              // On success, we should be able to receive notifications
          PushNotifications.addListener('registration',
          (token: PushNotificationToken) => {
          
            let msg = 'Registro de token , token: ' + token.value;

            if(this.plataforma.is('ios'))
            {
              console.log('IOS FMC REGISTR')
              fcm
            .getToken()
            .then((r) => {
              let dadosNot = {
                pushtoken:r.token
              }
              this.servicePushNotification.add(dadosNot)
              .then((res)=>{
                console.log('Push registrado com sucesso FMC  '+r.token)
              })
              .catch((err)=>{
                console.log('Push falha registrado  ')
              })
            })
            .catch((err) => console.log(err));
              
            }
            else
            {
              let dadosNot = {
                pushtoken:token.value
              }
              console.log(msg);
              this.servicePushNotification.add(dadosNot)
              .then((res)=>{
                console.log('Push registrado com sucesso ')
              })
              .catch((err)=>{
                console.log('Push falha registrado  ')
              })
            }
            //GRAVAR TOKEN NO USUARIO
            
            //alert(msg);
          }
        );

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError',
          (error: any) => {
          
            let msg = 'Error on registration: ' + JSON.stringify(error)
            console.log(msg);
            alert(msg);
          }
        );

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived',
          (notification: PushNotification) => {
            //Recebido pusher com APP aberto 
            let dados = notification;


            
            const notifs =  LocalNotifications.schedule({
              notifications: [
                {
                  title: dados.title,
                  body: dados.body,
                  id:1,
                  schedule: { at: new Date(Date.now() + 1000 * 5) },
                  sound:'beep.wav',
                  attachments: null,
                  actionTypeId: "",
                  extra: null
                }
              ]
            });
            //console.log('scheduled notifications', notifs);

            this.presentToast(
              dados.title,
              dados.body,
              dados.data.contatoPhoto
            )
            let msg = 'Push received: ' + JSON.stringify(notification)
            console.log(msg);
            //alert(msg);
          }
        );

        // Method quando for clicado na notificacao
        PushNotifications.addListener('pushNotificationActionPerformed',
          (notification: PushNotificationActionPerformed) => {

            //this.alertsDialogs.beep(200);
            let msg = 'Push action performed: ' + JSON.stringify(notification);
            console.log(msg)

            let data = notification["data"];
            let id = notification["id"];



            //let dados = notification;
            //let contatoUid = dados.notification.data.contatoUid;
          
            //this.abrirConversa(contatoUid);
          //alert(msg);
          }
        );

              // Register with Apple / Google to receive push via APNS/FCM
              PushNotifications.register()
              .then(()=>{
              
                
              })
              .catch((err) => alert(JSON.stringify(err)));
            } else {
              // Show some error
            }
          });

          
        }
        else
        {
          console.log('Identificado plataforma WEB');
        }
      })
      .catch(err=>{
        console.log(err);
        console.log('Error emitter')
      })
      
      
      

      
        
      

      
    }
    catch(err)
    {
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
  }

  async presentToast(titulo:string,message:string,photo:string) {
    let montando: string = '';
    let foto: string = '';
   
    montando =  "<p><strong>"+titulo+"</strong> envio... </p><p>"+message+"</p>";
    const toast = await this.toastController.create({
      message:montando,
      color:'light',
      animated: true,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }


  //ACOES DE BOTOES
 
  async contatoAbrir(contatoUid:string) {
    console.log('modal')
    const modal = await this.modal.create({
      component: AddPage,
      mode: 'ios',
      showBackdrop: false,
      componentProps: {
       
        contatoUid
      }
    });
    await modal.present();
  }
  public chatConversaOpen(conversaUid:string,contatoUid:string)
  {
    this.abrirComponente('abrirmensagems',{conversaUid,contatoUid});
  
  }

  btnBack(componente:string)
  {
    console.log('clicked back');
    if(componente == 'home')
    {
      console.log('back success');
      this.abrirComponente('conversasativas',{});
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

  async modalTransferencia(conversaUid:string) {
    const modal = await this.modal.create({
      component: TransferenciaPage,
      mode: 'ios',
      showBackdrop: false,
      componentProps: {
        currentUser: this.currentUser,
        conversaUid: conversaUid,
        origemChamada: 'home'
      }
    });
    await modal.present();
  }

  async modalTransferenciaAceite(notificacaoData:Itnotificacoes) {
    const modal = await this.modal.create({
      component: AceitePage,
      mode: 'ios',
      showBackdrop: false,
      componentProps: {
        currentUser: this.currentUser,
        notificacaoData: notificacaoData
      }
    });
    await modal.present();
  }

  async modalNotificacao(notificacaoData:Itnotificacoes) {
    const modal = await this.modal.create({
      component: AvisoPage,
      mode: 'ios',
      showBackdrop: false,
      componentProps: {
        currentUser: this.currentUser,
        notificacaoData: notificacaoData
      }
    });
    await modal.present();
  }

  async modalContatoLivre(notificacaoData:Itnotificacoes) {
    const modal = await this.modal.create({
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

  async contatoSelectGrupo(contatoId:string) {
    const modal = await this.modal.create({
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

  async parceiroConsulta(contatoId:string) {
    console.log('modal Parceiros->'+contatoId)
    const modal = await this.modal.create({
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

    const modal = await this.modal.create({
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

  async listaTransmissaoFiltros(transmissaoId : string) {
    const modal = await this.modal.create({
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

}
