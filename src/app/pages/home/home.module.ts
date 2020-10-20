import { CompatendimentocasosfluxoComponent } from './../../componentes/configuracoes/casos/fluxo/compatendimentocasosfluxo/compatendimentocasosfluxo.component';
import { CompatendimentocasosdetalheComponent } from './../../componentes/configuracoes/atendimento/casos/detalhe/compatendimentocasosdetalhe/compatendimentocasosdetalhe.component';
import { CompatendimentocasoshomeComponent } from './../../componentes/configuracoes/atendimento/casos/compatendimentocasoshome/compatendimentocasoshome.component';
import { CompatendimentodetalheComponent } from './../../componentes/configuracoes/atendimento/detalhe/compatendimentodetalhe/compatendimentodetalhe.component';
import { ComplisttransmissaodetalheComponent } from './../../componentes/chat/contatos/listatransmissao/complisttransmissaodetalhe/complisttransmissaodetalhe.component';
import { CompchatrelatoriosComponent } from 'src/app/componentes/chat/relatorios/compchatrelatorios/compchatrelatorios.component';
import { CompPedidoAddComponent } from './../../componentes/comercial/pedidos/add/comp-pedido-add/comp-pedido-add.component';
import { CompLaraHomeComponent } from './../../componentes/lara/home/comp-lara-home/comp-lara-home.component';
import { CompFiscalHomeComponent } from './../../componentes/fiscal/home/comp-fiscal-home/comp-fiscal-home.component';
import { CompAprendizadoHomeComponent } from './../../componentes/aprendizado/home/comp-aprendizado-home/comp-aprendizado-home.component';
import { CompAtendimentoHomeComponent } from './../../componentes/atendimento/comp-atendimento-home/comp-atendimento-home.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ConversaativalistaComponent } from 'src/app/componentes/chat/conversaativalista/conversaativalista.component';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { ConversacontentComponent } from 'src/app/componentes/chat/conversacontent/conversacontent.component';
import { FinanceiroHomeComponent } from 'src/app/componentes/financeiro/home/home.component';
import { FinanceiroDreComponent } from 'src/app/componentes/financeiro/dre/dre.component';
import { TodohomeComponent } from 'src/app/componentes/todo/todohome/todohome.component';
import { HomeComponent } from 'src/app/componentes/chat/contatos/home/home.component';
import { CompConsumosHomeComponent } from 'src/app/componentes/consumos/home/comp-consumos-home/comp-consumos-home.component';
import { AddComponent } from 'src/app/componentes/chat/contatos/add/add.component';
import { CompListaAddComponent } from 'src/app/componentes/chat/contatos/comp-lista-add/comp-lista-add.component';
import { CompComercialHomeComponent } from 'src/app/componentes/comercial/home/comp-comercial-home/comp-comercial-home.component';
import { CompConfiguracoesHomeComponent } from 'src/app/componentes/configuracoes/home/comp-configuracoes-home/comp-configuracoes-home.component';
import { CompTelegramComponent } from 'src/app/componentes/configuracoes/chat/comp-telegram/comp-telegram.component';
import { CompConfiguracoesFinanceiroHomeComponent } from 'src/app/componentes/configuracoes/financeiro/home/comp-configuracoes-financeiro-home/comp-configuracoes-financeiro-home.component';
import { CompConfiguracoesUsuariosHomeComponent } from 'src/app/componentes/configuracoes/usuarios/home/comp-configuracoes-usuarios-home/comp-configuracoes-usuarios-home.component';
import { CompConfiguracoesUsuariosAddComponent } from 'src/app/componentes/configuracoes/usuarios/add/comp-configuracoes-usuarios-add/comp-configuracoes-usuarios-add.component';
import { CompConfiguracoesProdutosHomeComponent } from 'src/app/componentes/configuracoes/produtos/home/comp-configuracoes-produtos-home/comp-configuracoes-produtos-home.component';
import { CompConfiguracoesChatHomeComponent } from 'src/app/componentes/configuracoes/chat/home/comp-configuracoes-chat-home/comp-configuracoes-chat-home.component';
import { CompConfiguracoesAtendimentoHomeComponent } from 'src/app/componentes/configuracoes/atendimento/home/comp-configuracoes-atendimento-home/comp-configuracoes-atendimento-home.component';

import { CompChatContatosListatransmissaoAddComponent } from 'src/app/componentes/chat/contatos/listatransmissao/add/comp-chat-contatos-listatransmissao-add/comp-chat-contatos-listatransmissao-add.component';
import { CompChatContatosListatransmissaoPerformanceComponent } from 'src/app/componentes/chat/contatos/listatransmissao/performance/comp-chat-contatos-listatransmissao-performance/comp-chat-contatos-listatransmissao-performance.component';

import { CompConfiguracoesChatSmsComponent } from 'src/app/componentes/configuracoes/chat/comp-configuracoes-chat-sms/comp-configuracoes-chat-sms.component';
import { MeusdadosComponent } from 'src/app/componentes/seguranca/meusdados/meusdados.component';

import { CompAdministracaoHomeComponent } from 'src/app/componentes/administracao/home/comp-administracao-home/comp-administracao-home.component';
import { CompAdministracaoEmpresadetalheComponent } from 'src/app/componentes/administracao/empresadetalhe/comp-administracao-empresadetalhe/comp-administracao-empresadetalhe.component';
import { CompConfiguracoesProdutoAddComponent } from 'src/app/componentes/configuracoes/produtos/add/comp-configuracoes-produto-add/comp-configuracoes-produto-add.component';
import { ConfigGeralComponent } from 'src/app/componentes/configuracoes/geral/geral.component';
import { CompticketaddComponent } from 'src/app/componentes/ticket/add/compticketadd/compticketadd.component';
import { CompatendimentodepartamentoComponent } from 'src/app/componentes/configuracoes/atendimento/departamento/compatendimentodepartamento/compatendimentodepartamento.component';
import { CompwpptemplateComponent } from 'src/app/componentes/configuracoes/atendimento/whatsapptemplate/compwpptemplate/compwpptemplate.component';
import { CompdevlogComponent } from 'src/app/componentes/configuracoes/desenvolvedor/compdevlog/compdevlog.component';
import { CompmssgautomaticaComponent } from 'src/app/componentes/configuracoes/atendimento/msgautomatica/compmssgautomatica/compmssgautomatica.component';
import { CompatendimentorelatoriooperaacoComponent } from 'src/app/componentes/atendimento/relatorios/compatendimentorelatoriooperaaco/compatendimentorelatoriooperaaco.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentesModule
    
  ],
  entryComponents: [
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
    CompListaAddComponent,
    CompComercialHomeComponent,
    CompLaraHomeComponent,
    CompConfiguracoesHomeComponent,
    CompTelegramComponent,
    CompConfiguracoesFinanceiroHomeComponent,
    CompConfiguracoesUsuariosHomeComponent,
    CompConfiguracoesUsuariosAddComponent,
    CompConfiguracoesProdutosHomeComponent,
    CompConfiguracoesChatHomeComponent,
    CompConfiguracoesAtendimentoHomeComponent,
    CompPedidoAddComponent,
    CompChatContatosListatransmissaoAddComponent,
    CompChatContatosListatransmissaoPerformanceComponent,
    CompConfiguracoesChatSmsComponent,
    CompchatrelatoriosComponent,
    ComplisttransmissaodetalheComponent,
    MeusdadosComponent,
    CompAdministracaoHomeComponent,
    CompAdministracaoEmpresadetalheComponent,
    CompConfiguracoesProdutoAddComponent,
    CompatendimentodetalheComponent,
    CompatendimentocasoshomeComponent,
    CompatendimentocasosdetalheComponent,
    CompatendimentocasosfluxoComponent,
    ConfigGeralComponent,
    CompticketaddComponent,
    CompatendimentodepartamentoComponent,
    CompwpptemplateComponent,
    CompdevlogComponent,
    CompmssgautomaticaComponent,
    CompatendimentorelatoriooperaacoComponent,

  ],
  declarations: [HomePage]
})

export class HomePageModule {}
