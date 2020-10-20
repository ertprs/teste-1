import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensagensPageRoutingModule } from './mensagens-routing.module';

import { MensagensPage } from './mensagens.page';
import { AutosizeModule } from 'ngx-autosize';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MensagensPageRoutingModule,
    AutosizeModule,
  ],
  declarations: [MensagensPage]
})
export class MensagensPageModule {}
