import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopovercontatosconversastartPageRoutingModule } from './popovercontatosconversastart-routing.module';

import { PopovercontatosconversastartPage } from './popovercontatosconversastart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopovercontatosconversastartPageRoutingModule
  ],
  declarations: [PopovercontatosconversastartPage]
})
export class PopovercontatosconversastartPageModule {}
