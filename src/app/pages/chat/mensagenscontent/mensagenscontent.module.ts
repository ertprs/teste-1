import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensagenscontentPageRoutingModule } from './mensagenscontent-routing.module';

import { MensagenscontentPage } from './mensagenscontent.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MensagenscontentPageRoutingModule
  ],
 
  declarations: [MensagenscontentPage]
})
export class MensagenscontentPageModule {}
