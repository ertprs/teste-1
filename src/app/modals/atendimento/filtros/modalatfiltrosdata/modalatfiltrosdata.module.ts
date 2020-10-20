import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalatfiltrosdataPageRoutingModule } from './modalatfiltrosdata-routing.module';

import { ModalatfiltrosdataPage } from './modalatfiltrosdata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalatfiltrosdataPageRoutingModule
  ],
  declarations: [ModalatfiltrosdataPage]
})
export class ModalatfiltrosdataPageModule {}
