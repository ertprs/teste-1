import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncaminharPageRoutingModule } from './encaminhar-routing.module';

import { EncaminharPage } from './encaminhar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncaminharPageRoutingModule
  ],
  declarations: [EncaminharPage]
})
export class EncaminharPageModule {}
