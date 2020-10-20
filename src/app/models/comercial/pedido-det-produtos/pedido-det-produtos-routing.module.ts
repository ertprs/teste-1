import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoDetProdutosPage } from './pedido-det-produtos.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoDetProdutosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoDetProdutosPageRoutingModule {}
