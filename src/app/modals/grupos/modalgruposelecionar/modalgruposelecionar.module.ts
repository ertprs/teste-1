import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalgruposelecionarPageRoutingModule } from './modalgruposelecionar-routing.module';

import { ModalgruposelecionarPage } from './modalgruposelecionar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalgruposelecionarPageRoutingModule
  ],
  declarations: [ModalgruposelecionarPage]
})
export class ModalgruposelecionarPageModule {}
