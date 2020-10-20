import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalenviarchatPageRoutingModule } from './modalenviarchat-routing.module';

import { ModalenviarchatPage } from './modalenviarchat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalenviarchatPageRoutingModule
  ],
  declarations: [ModalenviarchatPage]
})
export class ModalenviarchatPageModule {}
