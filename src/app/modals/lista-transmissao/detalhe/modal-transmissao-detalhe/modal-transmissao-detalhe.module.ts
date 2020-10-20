import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalTransmissaoDetalhePageRoutingModule } from './modal-transmissao-detalhe-routing.module';

import { ModalTransmissaoDetalhePage } from './modal-transmissao-detalhe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalTransmissaoDetalhePageRoutingModule
  ],
  declarations: [ModalTransmissaoDetalhePage]
})
export class ModalTransmissaoDetalhePageModule {}
