import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfiscalemissaonfePageRoutingModule } from './modalfiscalemissaonfe-routing.module';

import { ModalfiscalemissaonfePage } from './modalfiscalemissaonfe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfiscalemissaonfePageRoutingModule
  ],
  declarations: [ModalfiscalemissaonfePage]
})
export class ModalfiscalemissaonfePageModule {}
