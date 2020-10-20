import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfiscalncmaddPageRoutingModule } from './modalfiscalncmadd-routing.module';

import { ModalfiscalncmaddPage } from './modalfiscalncmadd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfiscalncmaddPageRoutingModule
  ],
  declarations: [ModalfiscalncmaddPage]
})
export class ModalfiscalncmaddPageModule {}
