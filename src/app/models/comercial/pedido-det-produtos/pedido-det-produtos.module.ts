import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoDetProdutosPageRoutingModule } from './pedido-det-produtos-routing.module';

import { PedidoDetProdutosPage } from './pedido-det-produtos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoDetProdutosPageRoutingModule
  ],
  declarations: [PedidoDetProdutosPage]
})
export class PedidoDetProdutosPageModule {}
