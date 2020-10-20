import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompchatcontatoeditPageRoutingModule } from './compchatcontatoedit-routing.module';

import { CompchatcontatoeditPage } from './compchatcontatoedit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompchatcontatoeditPageRoutingModule
  ],
  declarations: [CompchatcontatoeditPage]
})
export class CompchatcontatoeditPageModule {}
