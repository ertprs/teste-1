import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalComercialDashDetNegociandoPageRoutingModule } from './modal-comercial-dash-det-negociando-routing.module';

import { ModalComercialDashDetNegociandoPage } from './modal-comercial-dash-det-negociando.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalComercialDashDetNegociandoPageRoutingModule
  ],
  declarations: [ModalComercialDashDetNegociandoPage]
})
export class ModalComercialDashDetNegociandoPageModule {}
