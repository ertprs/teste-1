import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfiscalipisittributariaPageRoutingModule } from './modalfiscalipisittributaria-routing.module';

import { ModalfiscalipisittributariaPage } from './modalfiscalipisittributaria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfiscalipisittributariaPageRoutingModule
  ],
  declarations: [ModalfiscalipisittributariaPage]
})
export class ModalfiscalipisittributariaPageModule {}
