import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AceitePageRoutingModule } from './aceite-routing.module';

import { AceitePage } from './aceite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AceitePageRoutingModule
  ],
  declarations: [AceitePage]
})
export class AceitePageModule {}
