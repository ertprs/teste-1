import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfiscalcfopPageRoutingModule } from './modalfiscalcfop-routing.module';

import { ModalfiscalcfopPage } from './modalfiscalcfop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfiscalcfopPageRoutingModule
  ],
  declarations: [ModalfiscalcfopPage]
})
export class ModalfiscalcfopPageModule {}
