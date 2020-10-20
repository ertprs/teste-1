import { LoginGuard } from './guards/login.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  //PAGINAS SEGURAS
  { path: '', loadChildren: './pages/seguranca/login/login.module#LoginPageModule', canActivate: [LoginGuard] },
  { path: 'login', loadChildren: './pages/seguranca/login/login.module#LoginPageModule', canActivate: [LoginGuard] },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'homedesk', loadChildren: './pages/homedesk/homedesk.module#HomedeskPageModule', canActivate: [AuthGuard] },
  { path: 'notificacoes', loadChildren: './pages/notificacoes/notificacoes.module#NotificacoesPageModule', canActivate: [AuthGuard] },
  { path: 'empresaselect', loadChildren: './pages/seguranca/empresaselect/empresaselect.module#EmpresaselectPageModule', canActivate: [AuthGuard] },

  //CONFIGURACOES
  { path: 'configuracoes', loadChildren: './pages/configuracoes/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'configuracoes/chat/home', loadChildren: './pages/configuracoes/chat/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'configuracoes/chat/home/telegram', loadChildren: './pages/configuracoes/chat/telegram/telegram.module#TelegramPageModule', canActivate: [AuthGuard] },
  //CONFIGURACOES USURIOS
  { path: 'configuracoes/usuarios', loadChildren: './pages/configuracoes/usuarios/usuarios.module#UsuariosPageModule', canActivate: [AuthGuard] },
  { path: 'configuracoes/usuarios/add', loadChildren: './pages/configuracoes/usuarios/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  //CONFIGURACOES FINANCEIRO
  { path: 'configuracoes/financeiro', loadChildren: './pages/configuracoes/financeiro/financeiro.module#FinanceiroPageModule', canActivate: [AuthGuard] },
  
  //CONTATOS
  { path: 'chat/contatos', loadChildren: './pages/chat/contatos/contatos.module#ContatosPageModule', canActivate: [AuthGuard] },
  { path: 'chat/contatos/prep/comercial/:pedidoUid', loadChildren: './pages/chat/contatos/contatos.module#ContatosPageModule', canActivate: [AuthGuard] },
  { path: 'chat/contatos/add', loadChildren: './pages/chat/contatos/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'chat/contatos/add/:uid', loadChildren: './pages/chat/contatos/add/add.module#AddPageModule', canActivate: [AuthGuard] },

  //CONVERSAS
  { path: 'chat/mensagens/:contatoUid', loadChildren: './pages/chat/mensagens/mensagens.module#MensagensPageModule', canActivate: [AuthGuard] },
  { path: 'chat/encaminhar', loadChildren: './pages/chat/encaminhar/encaminhar.module#EncaminharPageModule', canActivate: [AuthGuard] },
  { path: 'chat/mensagenscontent/:contatoUid', loadChildren: './pages/chat/mensagenscontent/mensagenscontent.module#MensagenscontentPageModule', canActivate: [AuthGuard] },
 
  //PARCEIRO
  { path: 'parceiros/add', loadChildren: './pages/parceiros/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'parceiros/add/:parceiroUid', loadChildren: './pages/parceiros/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'parceiros/consulta', loadChildren: './pages/parceiros/consulta/consulta.module#ConsultaPageModule', canActivate: [AuthGuard] },
  { path: 'parceiros/consulta/:contatoUid', loadChildren: './pages/parceiros/consulta/consulta.module#ConsultaPageModule', canActivate: [AuthGuard] },

  //COMERCIAL
  { path: 'comercial/home', loadChildren: './pages/comercial/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'comercial/add', loadChildren: './pages/comercial/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'comercial/add/:pedidoUid', loadChildren: './pages/comercial/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'comercial/add/detalheitem/:itemUid', loadChildren: './pages/comercial/add/detalheitem/detalheitem.module#DetalheitemPageModule', canActivate: [AuthGuard] },

  //FINANCEIRO
  { path: 'faturamento', loadChildren: './pages/faturamento/faturamento.module#FaturamentoPageModule', canActivate: [AuthGuard]},
  { path: 'financeiro', loadChildren: './pages/financeiro/financeiro.module#FinanceiroPageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/condpagamento', loadChildren: './pages/financeiro/condpagamento/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/condpagamento/add', loadChildren: './pages/financeiro/condpagamento/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/condpagamento/add/:condUid', loadChildren: './pages/financeiro/condpagamento/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/tipoimpostos', loadChildren: './pages/financeiro/tipoimpostos/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/tipoimpostos/add', loadChildren: './pages/financeiro/tipoimpostos/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/tipoimpostos/add/:impostoUid', loadChildren: './pages/financeiro/tipoimpostos/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/bancos', loadChildren: './pages/financeiro/bancos/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/bancos/add', loadChildren: './pages/financeiro/bancos/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/bancos/add/:bancoUid', loadChildren: './pages/financeiro/bancos/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/categorias', loadChildren: './pages/financeiro/categorias/categorias.module#CategoriasPageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/categorias/add', loadChildren: './pages/financeiro/categorias/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/categorias/add/:uid', loadChildren: './pages/financeiro/categorias/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'financeiro/dre', loadChildren: './pages/financeiro/dre/home/home.module#HomePageModule', canActivate: [AuthGuard] },

  //PRODUTOS
  { path: 'produtos', loadChildren: './pages/produtos/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'produtos/add', loadChildren: './pages/produtos/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'produtos/add/:produtoUid', loadChildren: './pages/produtos/add/add.module#AddPageModule', canActivate: [AuthGuard] },

  //LARA
  { path: 'lara/home', loadChildren: './pages/lara/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'lara/aprendizado', loadChildren: './pages/lara/aprendizado/aprendizado.module#AprendizadoPageModule', canActivate: [AuthGuard] },
  { path: 'lara/aprendizado/add', loadChildren: './pages/lara/aprendizado/add/add.module#AddPageModule', canActivate: [AuthGuard] },
  { path: 'lara/aprendizado/add/:aprendizadoUid', loadChildren: './pages/lara/aprendizado/add/add.module#AddPageModule', canActivate: [AuthGuard] },

  //PAGINAS LIVRES
  { path: 'cadastro', loadChildren: () => import('./pages/seguranca/cadastro/cadastro.module').then( m => m.CadastroPageModule)},
  { path: 'recuperar', loadChildren: () => import('./pages/seguranca/recuperar/recuperar.module').then( m => m.RecuperarPageModule)},
 



  
  
 
 
  //{
  //  path: 'chatbot',
  //  loadChildren: () => import('./plugins/chatbot/chatbot.module').then( m => m.ChatbotPageModule)
  //},

  
  //{ path: 'meusdados', loadChildren: () => import('./pages/seguranca/meusdados/meusdados.module').then( m => m.MeusdadosPageModule)},
  
  //{
  //  path: 'cadastro',
  //  loadChildren: () => import('./pages/seguranca/cadastronovo/cadastronovo.module').then( m => m.CadastronovoPageModule)
  //}

 
 





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
