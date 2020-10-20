import { CompatendimentocasosfluxoComponent } from './configuracoes/casos/fluxo/compatendimentocasosfluxo/compatendimentocasosfluxo.component';
import { CompatendimentocasosdetalheComponent } from './configuracoes/atendimento/casos/detalhe/compatendimentocasosdetalhe/compatendimentocasosdetalhe.component';
import { CompatendimentocasoshomeComponent } from './configuracoes/atendimento/casos/compatendimentocasoshome/compatendimentocasoshome.component';
import { CompatendimentodepartamentoComponent } from './configuracoes/atendimento/departamento/compatendimentodepartamento/compatendimentodepartamento.component';
import { CompatendimentodetalheComponent } from './configuracoes/atendimento/detalhe/compatendimentodetalhe/compatendimentodetalhe.component';
import { ComplisttransmissaodetalheComponent } from './chat/contatos/listatransmissao/complisttransmissaodetalhe/complisttransmissaodetalhe.component';
import { CompPedidoAddComponent } from './comercial/pedidos/add/comp-pedido-add/comp-pedido-add.component';
import { CompLaraHomeComponent } from './lara/home/comp-lara-home/comp-lara-home.component';
import { CompComercialHomeComponent } from './comercial/home/comp-comercial-home/comp-comercial-home.component';
import { CompFiscalHomeComponent } from './fiscal/home/comp-fiscal-home/comp-fiscal-home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

//COMPONENTES
import { ConversacontentComponent } from 'src/app/componentes/chat/conversacontent/conversacontent.component';
import { ConversaativalistaComponent } from 'src/app/componentes/chat/conversaativalista/conversaativalista.component';
import { FinanceiroHomeComponent } from 'src/app/componentes/financeiro/home/home.component';
import { FinanceiroDreComponent } from 'src/app/componentes/financeiro/dre/dre.component';

import { CompAprendizadoHomeComponent } from './aprendizado/home/comp-aprendizado-home/comp-aprendizado-home.component';
import { CompAtendimentoHomeComponent } from './atendimento/comp-atendimento-home/comp-atendimento-home.component';
import { CompConsumosHomeComponent } from './consumos/home/comp-consumos-home/comp-consumos-home.component';
import { CompConfiguracoesHomeComponent } from 'src/app/componentes/configuracoes/home/comp-configuracoes-home/comp-configuracoes-home.component';
import { CompTelegramComponent } from 'src/app/componentes/configuracoes/chat/comp-telegram/comp-telegram.component';
import { CompConfiguracoesChatSmsComponent } from 'src/app/componentes/configuracoes/chat/comp-configuracoes-chat-sms/comp-configuracoes-chat-sms.component';
import { CompConfiguracoesAtendimentoHomeComponent } from 'src/app/componentes/configuracoes/atendimento/home/comp-configuracoes-atendimento-home/comp-configuracoes-atendimento-home.component';
import { CompConfiguracoesFinanceiroHomeComponent } from 'src/app/componentes/configuracoes/financeiro/home/comp-configuracoes-financeiro-home/comp-configuracoes-financeiro-home.component';
import { CompConfiguracoesUsuariosHomeComponent } from 'src/app/componentes/configuracoes/usuarios/home/comp-configuracoes-usuarios-home/comp-configuracoes-usuarios-home.component';
import { CompConfiguracoesUsuariosAddComponent } from 'src/app/componentes/configuracoes/usuarios/add/comp-configuracoes-usuarios-add/comp-configuracoes-usuarios-add.component';
import { CompConfiguracoesProdutosHomeComponent } from 'src/app/componentes/configuracoes/produtos/home/comp-configuracoes-produtos-home/comp-configuracoes-produtos-home.component';
import { CompConfiguracoesChatHomeComponent } from 'src/app/componentes/configuracoes/chat/home/comp-configuracoes-chat-home/comp-configuracoes-chat-home.component';
import { CompListaAddComponent } from 'src/app/componentes/chat/contatos/comp-lista-add/comp-lista-add.component';
import { CompChatContatosListatransmissaoAddComponent } from 'src/app/componentes/chat/contatos/listatransmissao/add/comp-chat-contatos-listatransmissao-add/comp-chat-contatos-listatransmissao-add.component';
import { CompChatContatosListatransmissaoPerformanceComponent } from 'src/app/componentes/chat/contatos/listatransmissao/performance/comp-chat-contatos-listatransmissao-performance/comp-chat-contatos-listatransmissao-performance.component';
import { AddComponent } from './chat/contatos/add/add.component';
import { Contatos } from 'src/app/interface/chat/contatos';

//CHAT
import { HomeComponent }  from "src/app/componentes/chat/contatos/home/home.component";

//ADMINISTRACAO
import { CompAdministracaoHomeComponent } from 'src/app/componentes/administracao/home/comp-administracao-home/comp-administracao-home.component';
import { CompAdministracaoEmpresadetalheComponent } from 'src/app/componentes/administracao/empresadetalhe/comp-administracao-empresadetalhe/comp-administracao-empresadetalhe.component';
import { TodohomeComponent } from './todo/todohome/todohome.component';
import { FormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';

//SEGURANÇA
import { MeusdadosComponent } from 'src/app/componentes/seguranca/meusdados/meusdados.component';
import { CompConfiguracoesProdutoAddComponent } from './configuracoes/produtos/add/comp-configuracoes-produto-add/comp-configuracoes-produto-add.component';
import { CompchatrelatoriosComponent } from './chat/relatorios/compchatrelatorios/compchatrelatorios.component';
import { CompcharellistaComponent } from './chat/relatorios/compchatrellista/compcharellista/compcharellista.component';
import { CompdevlogComponent } from './configuracoes/desenvolvedor/compdevlog/compdevlog.component';
import { CompatendimentorelatoriooperaacoComponent } from './atendimento/relatorios/compatendimentorelatoriooperaaco/compatendimentorelatoriooperaaco.component';
import { CompmssgautomaticaComponent } from './configuracoes/atendimento/msgautomatica/compmssgautomatica/compmssgautomatica.component';
import { CompticketaddComponent } from './ticket/add/compticketadd/compticketadd.component';
import { CompwpptemplateComponent } from './configuracoes/atendimento/whatsapptemplate/compwpptemplate/compwpptemplate.component';
import { ConfigGeralComponent } from './configuracoes/geral/geral.component';
import { BrMaskerModule } from 'br-mask';
import { DragareaDirective } from '../directive/dragarea.directive';
import { DropzoneDirective } from '../directive/dropzone.directive';
import { NgxFilesizeModule } from 'ngx-filesize';

const PAGES_COMPONENTS = [
  ConversacontentComponent,
  ConversaativalistaComponent,
  FinanceiroHomeComponent,
  FinanceiroDreComponent,
  TodohomeComponent,
  HomeComponent,
  CompAtendimentoHomeComponent,
  CompAprendizadoHomeComponent,
  CompFiscalHomeComponent,
  CompConsumosHomeComponent,
  AddComponent,
  CompComercialHomeComponent,
  CompLaraHomeComponent,
  CompConfiguracoesHomeComponent,
  CompTelegramComponent,
  CompConfiguracoesAtendimentoHomeComponent,
  CompConfiguracoesFinanceiroHomeComponent,
  CompConfiguracoesUsuariosHomeComponent,
  CompConfiguracoesProdutosHomeComponent,
  CompConfiguracoesChatHomeComponent,
  CompConfiguracoesUsuariosAddComponent,
  CompListaAddComponent,
  CompPedidoAddComponent,
  CompChatContatosListatransmissaoAddComponent,
  CompChatContatosListatransmissaoPerformanceComponent,
  CompConfiguracoesChatSmsComponent,
  MeusdadosComponent,
  CompConfiguracoesProdutoAddComponent,
  CompchatrelatoriosComponent,
  CompAdministracaoHomeComponent,
  CompAdministracaoEmpresadetalheComponent,
  ComplisttransmissaodetalheComponent,
  CompatendimentodetalheComponent,
  CompatendimentodepartamentoComponent,
  CompatendimentocasoshomeComponent,
  CompatendimentocasosdetalheComponent,
  CompatendimentocasosfluxoComponent,
  CompcharellistaComponent,
  CompdevlogComponent,
  CompatendimentorelatoriooperaacoComponent,
  CompmssgautomaticaComponent,
  CompticketaddComponent,
  CompwpptemplateComponent,
  ConfigGeralComponent,
  DropzoneDirective
];

@NgModule({
  declarations: [
    PAGES_COMPONENTS
  ],
  exports: [
    PAGES_COMPONENTS
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AutosizeModule,
    BrMaskerModule,
    NgxFilesizeModule
  ]
})
export class ComponentesModule { }