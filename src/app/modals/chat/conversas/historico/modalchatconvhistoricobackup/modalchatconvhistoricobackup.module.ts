import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalchatconvhistoricobackupPageRoutingModule } from './modalchatconvhistoricobackup-routing.module';

import { ModalchatconvhistoricobackupPage } from './modalchatconvhistoricobackup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalchatconvhistoricobackupPageRoutingModule
  ],
  declarations: [ModalchatconvhistoricobackupPage]
})
export class ModalchatconvhistoricobackupPageModule {}
