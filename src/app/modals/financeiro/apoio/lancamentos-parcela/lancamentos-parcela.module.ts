import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LancamentosParcelaPageRoutingModule } from './lancamentos-parcela-routing.module';

import { LancamentosParcelaPage } from './lancamentos-parcela.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LancamentosParcelaPageRoutingModule
  ],
  declarations: [LancamentosParcelaPage]
})
export class LancamentosParcelaPageModule {}
