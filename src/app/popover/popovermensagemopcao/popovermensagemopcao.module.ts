import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopovermensagemopcaoPageRoutingModule } from './popovermensagemopcao-routing.module';

import { PopovermensagemopcaoPage } from './popovermensagemopcao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopovermensagemopcaoPageRoutingModule
  ],
  declarations: [PopovermensagemopcaoPage]
})
export class PopovermensagemopcaoPageModule {}
