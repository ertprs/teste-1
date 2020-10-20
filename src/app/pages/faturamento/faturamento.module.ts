import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaturamentoPageRoutingModule } from './faturamento-routing.module';

import { FaturamentoPage } from './faturamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaturamentoPageRoutingModule
  ],
  declarations: [FaturamentoPage]
})
export class FaturamentoPageModule {}
