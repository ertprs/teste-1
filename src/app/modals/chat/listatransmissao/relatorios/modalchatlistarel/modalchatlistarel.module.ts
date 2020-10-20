import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalchatlistarelPageRoutingModule } from './modalchatlistarel-routing.module';

import { ModalchatlistarelPage } from './modalchatlistarel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalchatlistarelPageRoutingModule
  ],
  declarations: [ModalchatlistarelPage]
})
export class ModalchatlistarelPageModule {}
