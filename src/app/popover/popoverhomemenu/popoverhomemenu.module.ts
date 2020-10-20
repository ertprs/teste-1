import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverhomemenuPageRoutingModule } from './popoverhomemenu-routing.module';

import { PopoverhomemenuPage } from './popoverhomemenu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverhomemenuPageRoutingModule
  ],
  declarations: [PopoverhomemenuPage]
})
export class PopoverhomemenuPageModule {}
