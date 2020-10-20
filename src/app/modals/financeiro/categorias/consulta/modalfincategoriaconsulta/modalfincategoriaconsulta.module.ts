import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfincategoriaconsultaPageRoutingModule } from './modalfincategoriaconsulta-routing.module';

import { ModalfincategoriaconsultaPage } from './modalfincategoriaconsulta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfincategoriaconsultaPageRoutingModule
  ],
  declarations: [ModalfincategoriaconsultaPage]
})
export class ModalfincategoriaconsultaPageModule {}
