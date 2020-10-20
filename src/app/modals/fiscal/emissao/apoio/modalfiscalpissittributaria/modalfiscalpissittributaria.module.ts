import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfiscalpissittributariaPageRoutingModule } from './modalfiscalpissittributaria-routing.module';

import { ModalfiscalpissittributariaPage } from './modalfiscalpissittributaria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfiscalpissittributariaPageRoutingModule
  ],
  declarations: [ModalfiscalpissittributariaPage]
})
export class ModalfiscalpissittributariaPageModule {}
