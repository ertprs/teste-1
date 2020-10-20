import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfinrelselecionarPageRoutingModule } from './modalfinrelselecionar-routing.module';

import { ModalfinrelselecionarPage } from './modalfinrelselecionar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfinrelselecionarPageRoutingModule
  ],
  declarations: [ModalfinrelselecionarPage]
})
export class ModalfinrelselecionarPageModule {}
