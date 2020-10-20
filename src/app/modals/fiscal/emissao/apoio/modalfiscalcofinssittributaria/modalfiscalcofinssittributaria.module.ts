import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfiscalcofinssittributariaPageRoutingModule } from './modalfiscalcofinssittributaria-routing.module';

import { ModalfiscalcofinssittributariaPage } from './modalfiscalcofinssittributaria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfiscalcofinssittributariaPageRoutingModule
  ],
  declarations: [ModalfiscalcofinssittributariaPage]
})
export class ModalfiscalcofinssittributariaPageModule {}
