import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RespostaautomaticaPageRoutingModule } from './respostaautomatica-routing.module';

import { RespostaautomaticaPage } from './respostaautomatica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RespostaautomaticaPageRoutingModule
  ],
  declarations: [RespostaautomaticaPage]
})
export class RespostaautomaticaPageModule {}
