import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalcontatofiltrosPageRoutingModule } from './modalcontatofiltros-routing.module';

import { ModalcontatofiltrosPage } from './modalcontatofiltros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalcontatofiltrosPageRoutingModule
  ],
  declarations: [ModalcontatofiltrosPage]
})
export class ModalcontatofiltrosPageModule {}
