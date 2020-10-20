import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalComercialDashDetLeadsPageRoutingModule } from './modal-comercial-dash-det-leads-routing.module';

import { ModalComercialDashDetLeadsPage } from './modal-comercial-dash-det-leads.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalComercialDashDetLeadsPageRoutingModule
  ],
  declarations: [ModalComercialDashDetLeadsPage]
})
export class ModalComercialDashDetLeadsPageModule {}
