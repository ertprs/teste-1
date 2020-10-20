import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncerrarPageRoutingModule } from './encerrar-routing.module';

import { EncerrarPage } from './encerrar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncerrarPageRoutingModule
  ],
  declarations: [EncerrarPage]
})
export class EncerrarPageModule {}
