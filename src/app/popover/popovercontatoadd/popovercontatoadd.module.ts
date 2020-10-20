import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopovercontatoaddPageRoutingModule } from './popovercontatoadd-routing.module';

import { PopovercontatoaddPage } from './popovercontatoadd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopovercontatoaddPageRoutingModule
  ],
  declarations: [PopovercontatoaddPage]
})
export class PopovercontatoaddPageModule {}
