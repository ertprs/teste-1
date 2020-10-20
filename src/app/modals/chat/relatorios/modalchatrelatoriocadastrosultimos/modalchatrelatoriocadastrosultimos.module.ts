import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalchatrelatoriocadastrosultimosPageRoutingModule } from './modalchatrelatoriocadastrosultimos-routing.module';

import { ModalchatrelatoriocadastrosultimosPage } from './modalchatrelatoriocadastrosultimos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalchatrelatoriocadastrosultimosPageRoutingModule
  ],
  declarations: [ModalchatrelatoriocadastrosultimosPage]
})
export class ModalchatrelatoriocadastrosultimosPageModule {}
