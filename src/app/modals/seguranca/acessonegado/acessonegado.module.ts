import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcessonegadoPageRoutingModule } from './acessonegado-routing.module';

import { AcessonegadoPage } from './acessonegado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcessonegadoPageRoutingModule
  ],
  declarations: [AcessonegadoPage]
})
export class AcessonegadoPageModule {}
