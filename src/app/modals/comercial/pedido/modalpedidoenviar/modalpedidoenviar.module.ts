import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalpedidoenviarPageRoutingModule } from './modalpedidoenviar-routing.module';

import { ModalpedidoenviarPage } from './modalpedidoenviar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalpedidoenviarPageRoutingModule
  ],
  declarations: [ModalpedidoenviarPage]
})
export class ModalpedidoenviarPageModule {}
