import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalchatconversastartPageRoutingModule } from './modalchatconversastart-routing.module';

import { ModalchatconversastartPage } from './modalchatconversastart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalchatconversastartPageRoutingModule
  ],
  declarations: [ModalchatconversastartPage]
})
export class ModalchatconversastartPageModule {}
