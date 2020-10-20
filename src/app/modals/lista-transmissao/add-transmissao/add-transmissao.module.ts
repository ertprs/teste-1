import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTransmissaoPageRoutingModule } from './add-transmissao-routing.module';

import { AddTransmissaoPage } from './add-transmissao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTransmissaoPageRoutingModule
  ],
  declarations: [AddTransmissaoPage]
})
export class AddTransmissaoPageModule {}
