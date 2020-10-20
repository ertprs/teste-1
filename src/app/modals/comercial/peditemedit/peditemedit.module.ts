import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeditemeditPageRoutingModule } from './peditemedit-routing.module';

import { PeditemeditPage } from './peditemedit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeditemeditPageRoutingModule
  ],
  declarations: [PeditemeditPage]
})
export class PeditemeditPageModule {}
