import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CasoeventoaddPageRoutingModule } from './casoeventoadd-routing.module';

import { CasoeventoaddPage } from './casoeventoadd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CasoeventoaddPageRoutingModule
  ],
  declarations: [CasoeventoaddPage]
})
export class CasoeventoaddPageModule {}
