import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltrosPesquisaTransmissaoPageRoutingModule } from './filtros-pesquisa-transmissao-routing.module';

import { FiltrosPesquisaTransmissaoPage } from './filtros-pesquisa-transmissao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltrosPesquisaTransmissaoPageRoutingModule
  ],
  declarations: [FiltrosPesquisaTransmissaoPage]
})
export class FiltrosPesquisaTransmissaoPageModule {}
