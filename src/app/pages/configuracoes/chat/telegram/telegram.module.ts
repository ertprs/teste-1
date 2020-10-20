import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TelegramPageRoutingModule } from './telegram-routing.module';

import { TelegramPage } from './telegram.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TelegramPageRoutingModule
  ],
  declarations: [TelegramPage]
})
export class TelegramPageModule {}
