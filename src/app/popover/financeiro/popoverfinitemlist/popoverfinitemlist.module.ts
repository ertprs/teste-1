import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverfinitemlistPageRoutingModule } from './popoverfinitemlist-routing.module';

import { PopoverfinitemlistPage } from './popoverfinitemlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverfinitemlistPageRoutingModule
  ],
  declarations: [PopoverfinitemlistPage]
})
export class PopoverfinitemlistPageModule {}
