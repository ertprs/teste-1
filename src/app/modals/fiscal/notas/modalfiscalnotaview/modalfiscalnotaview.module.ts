import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfiscalnotaviewPageRoutingModule } from './modalfiscalnotaview-routing.module';

import { ModalfiscalnotaviewPage } from './modalfiscalnotaview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfiscalnotaviewPageRoutingModule
  ],
  declarations: [ModalfiscalnotaviewPage]
})
export class ModalfiscalnotaviewPageModule {}
