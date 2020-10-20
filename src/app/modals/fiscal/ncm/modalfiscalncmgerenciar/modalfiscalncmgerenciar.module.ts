import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfiscalncmgerenciarPageRoutingModule } from './modalfiscalncmgerenciar-routing.module';

import { ModalfiscalncmgerenciarPage } from './modalfiscalncmgerenciar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfiscalncmgerenciarPageRoutingModule
  ],
  declarations: [ModalfiscalncmgerenciarPage]
})
export class ModalfiscalncmgerenciarPageModule {}
