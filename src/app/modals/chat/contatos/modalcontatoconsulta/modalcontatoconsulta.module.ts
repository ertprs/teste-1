import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalcontatoconsultaPageRoutingModule } from './modalcontatoconsulta-routing.module';

import { ModalcontatoconsultaPage } from './modalcontatoconsulta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalcontatoconsultaPageRoutingModule
  ],
  declarations: [ModalcontatoconsultaPage]
})
export class ModalcontatoconsultaPageModule {}
