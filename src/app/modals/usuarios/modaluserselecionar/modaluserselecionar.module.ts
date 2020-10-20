import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModaluserselecionarPageRoutingModule } from './modaluserselecionar-routing.module';

import { ModaluserselecionarPage } from './modaluserselecionar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModaluserselecionarPageRoutingModule
  ],
  declarations: [ModaluserselecionarPage]
})
export class ModaluserselecionarPageModule {}
