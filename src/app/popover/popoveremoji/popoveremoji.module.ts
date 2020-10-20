import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoveremojiPageRoutingModule } from './popoveremoji-routing.module';

import { PopoveremojiPage } from './popoveremoji.page';

import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoveremojiPageRoutingModule,
    PickerModule
  ],
  declarations: [PopoveremojiPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class PopoveremojiPageModule {}
