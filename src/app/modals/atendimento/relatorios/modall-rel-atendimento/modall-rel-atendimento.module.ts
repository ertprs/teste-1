import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModallRelAtendimentoPageRoutingModule } from './modall-rel-atendimento-routing.module';

import { ModallRelAtendimentoPage } from './modall-rel-atendimento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModallRelAtendimentoPageRoutingModule
  ],
  declarations: [ModallRelAtendimentoPage]
})
export class ModallRelAtendimentoPageModule {}
