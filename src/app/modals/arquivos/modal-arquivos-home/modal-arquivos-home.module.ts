import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalArquivosHomePageRoutingModule } from './modal-arquivos-home-routing.module';

import { ModalArquivosHomePage } from './modal-arquivos-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalArquivosHomePageRoutingModule
  ],
  declarations: [ModalArquivosHomePage]
})
export class ModalArquivosHomePageModule {}
