import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalcomapoiohistoricoPageRoutingModule } from './modalcomapoiohistorico-routing.module';

import { ModalcomapoiohistoricoPage } from './modalcomapoiohistorico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalcomapoiohistoricoPageRoutingModule
  ],
  declarations: [ModalcomapoiohistoricoPage]
})
export class ModalcomapoiohistoricoPageModule {}
