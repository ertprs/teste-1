import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfinrecaddPageRoutingModule } from './modalfinrecadd-routing.module';

import { ModalfinrecaddPage } from './modalfinrecadd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfinrecaddPageRoutingModule
  ],
  declarations: [ModalfinrecaddPage]
})
export class ModalfinrecaddPageModule {}
