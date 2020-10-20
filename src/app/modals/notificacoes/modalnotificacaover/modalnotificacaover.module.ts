import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalnotificacaoverPageRoutingModule } from './modalnotificacaover-routing.module';

import { ModalnotificacaoverPage } from './modalnotificacaover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalnotificacaoverPageRoutingModule
  ],
  declarations: [ModalnotificacaoverPage]
})
export class ModalnotificacaoverPageModule {}
