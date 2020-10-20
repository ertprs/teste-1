import { ModalgruposelecionarPageModule } from './modals/grupos/modalgruposelecionar/modalgruposelecionar.module';
import { PopovercontatoshomeopcoesitensselecionadosPageModule } from './popover/contatos/home/popovercontatoshomeopcoesitensselecionados/popovercontatoshomeopcoesitensselecionados.module';
import { ModalcontatofiltrosPageModule } from './modals/chat/modalcontatofiltros/modalcontatofiltros.module';
import { ModaluserselecionarPageModule } from './modals/usuarios/modaluserselecionar/modaluserselecionar.module';
import { ModalatfiltrosdataPageModule } from './modals/atendimento/filtros/modalatfiltrosdata/modalatfiltrosdata.module';
import { PopoveratdashfiltrosPageModule } from './popover/atendimento/popoveratdashfiltros/popoveratdashfiltros.module';
import { ModalnotificacaoverPageModule } from './modals/notificacoes/modalnotificacaover/modalnotificacaover.module';
import { ModalchatrelatoriocadastrosultimosPageModule } from './modals/chat/relatorios/modalchatrelatoriocadastrosultimos/modalchatrelatoriocadastrosultimos.module';
import { ModalbackupPageModule } from './modals/arquivos/backupt/modalbackup/modalbackup.module';
import { PopovergerenciadorarquivosPageModule } from './popover/arquivos/popovergerenciadorarquivos/popovergerenciadorarquivos.module';
import { ModalContatoImportPageModule } from './modals/chat/modal-contato-import/modal-contato-import.module';

import { PedidoDetProdutosPageModule } from './models/comercial/pedido-det-produtos/pedido-det-produtos.module';
import { ModalTransmissaoDetalhePageModule } from './modals/lista-transmissao/detalhe/modal-transmissao-detalhe/modal-transmissao-detalhe.module';
import { ModalComercialDashDetNegociandoPageModule } from './modals/dash/modal-comercial-dash-det-negociando/modal-comercial-dash-det-negociando.module';
import { ModalComercialDashDetLeadsPageModule } from './modals/comercial/dash/modal-comercial-dash-det-leads/modal-comercial-dash-det-leads.module';
import { VisualizarconversaPageModule } from './modals/chat/mensagem/visualizarconversa/visualizarconversa.module';
import { ModalpedidoenviarPageModule } from './modals/comercial/pedido/modalpedidoenviar/modalpedidoenviar.module';
import { PeditemeditPageModule } from './modals/comercial/peditemedit/peditemedit.module';
import { ModestoqueconsultaPageModule } from './modals/estoque/modestoqueconsulta/modestoqueconsulta.module';
import { AnexosPageModule } from './modals/chat/anexos/anexos.module';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { ModelAprendizadoAddPageModule } from './modals/aprendizado/add/model-aprendizado-add/model-aprendizado-add.module';
import { PgTodoAddPageModule } from './pages/todo/add/pg-todo-add/pg-todo-add.module';
import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';


import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';

//POPOVERS
import { PopoverhomemenuPageModule } from './popover/popoverhomemenu/popoverhomemenu.module';
import { PopovermensagensComponentModule } from './popover/popovermensagens/popovermensagens.module';
import { PopovermensagemopcaoPageModule } from './popover/popovermensagemopcao/popovermensagemopcao.module';
import { PopovercontatoaddPageModule } from './popover/popovercontatoadd/popovercontatoadd.module';
import { PopoveremojiPageModule } from 'src/app/popover/popoveremoji/popoveremoji.module';


//modals
import { ConsultaPageModule } from './modals/parceiros/consulta/consulta.module';
import { ViewimagePageModule } from './modals/chat/mensagem/viewimage/viewimage.module';
import { EncerrarPageModule } from './modals/chat/mensagem/encerrar/encerrar.module';
import { RespostaautomaticaPageModule } from './modals/chat/mensagem/respostaautomatica/respostaautomatica.module';
import { TransferenciaPageModule } from 'src/app/modals/chat/transferencia/transferencia.module';
import { AceitePageModule } from 'src/app/modals/chat/transferencia/aceite/aceite.module';
import { AvisoPageModule } from 'src/app/modals/notificacoes/aviso/aviso.module';
import { AddPageModule } from './pages/chat/contatos/add/add.module';
import { EncaminharPageModule } from './pages/chat/encaminhar/encaminhar.module';
import { ContatolivrePageModule } from 'src/app/modals/chat/contatolivre/contatolivre.module';
import { ModalParceiroAddPageModule } from 'src/app/modals/parceiros/add/add.module';
import { AddTransmissaoPageModule } from 'src/app/modals/lista-transmissao/add-transmissao/add-transmissao.module';
import { SelectContatosPageModule } from 'src/app/modals/lista-transmissao/select-contatos/select-contatos.module';
import { AddGrupoPageModule } from 'src/app/modals/grupos/add-grupo/add-grupo.module';

import { HomeGrupoPageModule } from 'src/app/modals/grupos/home-grupo/home-grupo.module';
import { FiltrosPesquisaTransmissaoPageModule } from 'src/app/modals/lista-transmissao/filtros-pesquisa-transmissao/filtros-pesquisa-transmissao.module';

import { ModalArquivosHomePageModule } from 'src/app/modals/arquivos/modal-arquivos-home/modal-arquivos-home.module';




import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
// import { PapaParseModule } from 'ngx-papaparse';


import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';


import { Dialogs } from '@ionic-native/dialogs/ngx';
import { NgxMaskIonicModule} from 'ngx-mask-ionic';

//RECOGNIZE
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

//MODULO DE COMPONENTES
import { ProvEmitterEventService } from './provider/prov-emitter-event.service';
import { ComponentesModule } from './componentes/componentes.module';
import { DropzoneDirective } from './directive/dropzone.directive';

import { PickerModule } from '@ctrl/ngx-emoji-mart';



import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AcessonegadoPageModule } from './modals/seguranca/acessonegado/acessonegado.module';
import { CasoeventoaddPageModule } from './modals/casos/casoeventoadd/casoeventoadd.module';
import { AusentePageModule } from './modals/notificacoes/ausente/ausente.module';
import { Chooser } from '@ionic-native/chooser/ngx';
import { DragareaDirective } from './directive/dragarea.directive';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    ComponentesModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    
    ConsultaPageModule,
    ViewimagePageModule,
    AddPageModule,
    EncerrarPageModule,
    AceitePageModule,
    AvisoPageModule,
    ContatolivrePageModule,
    EncaminharPageModule,
    TransferenciaPageModule,
    RespostaautomaticaPageModule,
    PopoverhomemenuPageModule,
    PopovermensagensComponentModule,
    PopovermensagemopcaoPageModule,
    PopovercontatoaddPageModule,
    PopoveratdashfiltrosPageModule,
    PopoveremojiPageModule,
    PopovergerenciadorarquivosPageModule,
    PopovercontatoshomeopcoesitensselecionadosPageModule,
    PeditemeditPageModule,
    HttpClientModule,
    PgTodoAddPageModule,
    ModelAprendizadoAddPageModule,
    ModalComercialDashDetLeadsPageModule,
    ModalComercialDashDetNegociandoPageModule,
    ModalContatoImportPageModule,
    ModalTransmissaoDetalhePageModule,
    ModalatfiltrosdataPageModule,
    ModaluserselecionarPageModule,
    ModalcontatofiltrosPageModule,
    AcessonegadoPageModule,
    PedidoDetProdutosPageModule,
    VisualizarconversaPageModule,
    ModalpedidoenviarPageModule,
    ModalParceiroAddPageModule,
    ModalbackupPageModule,
    ModalchatrelatoriocadastrosultimosPageModule,
    ModalnotificacaoverPageModule,
    ModalgruposelecionarPageModule,
    CasoeventoaddPageModule,
    AnexosPageModule,
    AddTransmissaoPageModule,
    SelectContatosPageModule,
    ModestoqueconsultaPageModule,
    HomeGrupoPageModule,
    AddGrupoPageModule,

    ModalArquivosHomePageModule,

    FiltrosPesquisaTransmissaoPageModule,

    
    IonicStorageModule.forRoot(),

    NgxMaskIonicModule.forRoot(),
    //MODELS

    PickerModule,
    AusentePageModule,
    ],
  providers: [
    StatusBar,
    SplashScreen,
  
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NavigationBar,
    HTTP,
    FirebaseAnalytics,
    FileTransfer,  
    FileTransferObject,
    File,
    AndroidPermissions,
    FileChooser,
    FilePath,
    Dialogs,
    SpeechRecognition,
    TextToSpeech,
    ProvEmitterEventService,
    NativeAudio,
    SocialSharing,
    Chooser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
