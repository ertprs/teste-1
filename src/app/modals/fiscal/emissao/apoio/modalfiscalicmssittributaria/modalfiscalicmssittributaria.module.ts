import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfiscalicmssittributariaPageRoutingModule } from './modalfiscalicmssittributaria-routing.module';

import { ModalfiscalicmssittributariaPage } from './modalfiscalicmssittributaria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfiscalicmssittributariaPageRoutingModule
  ],
  declarations: [ModalfiscalicmssittributariaPage]
})
export class ModalfiscalicmssittributariaPageModule {}
