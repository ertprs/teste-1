import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoveratdashfiltrosPageRoutingModule } from './popoveratdashfiltros-routing.module';

import { PopoveratdashfiltrosPage } from './popoveratdashfiltros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoveratdashfiltrosPageRoutingModule
  ],
  declarations: [PopoveratdashfiltrosPage]
})
export class PopoveratdashfiltrosPageModule {}
