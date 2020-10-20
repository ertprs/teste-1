import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModelcomapoiocondpagamentoPageRoutingModule } from './modelcomapoiocondpagamento-routing.module';

import { ModelcomapoiocondpagamentoPage } from './modelcomapoiocondpagamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModelcomapoiocondpagamentoPageRoutingModule
  ],
  declarations: [ModelcomapoiocondpagamentoPage]
})
export class ModelcomapoiocondpagamentoPageModule {}
