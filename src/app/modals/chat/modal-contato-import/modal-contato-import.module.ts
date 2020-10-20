import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalContatoImportPageRoutingModule } from './modal-contato-import-routing.module';

import { ModalContatoImportPage } from './modal-contato-import.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalContatoImportPageRoutingModule
  ],
  declarations: [ModalContatoImportPage]
})
export class ModalContatoImportPageModule {}
