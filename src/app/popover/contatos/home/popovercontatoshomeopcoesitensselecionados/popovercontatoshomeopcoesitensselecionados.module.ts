import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopovercontatoshomeopcoesitensselecionadosPageRoutingModule } from './popovercontatoshomeopcoesitensselecionados-routing.module';

import { PopovercontatoshomeopcoesitensselecionadosPage } from './popovercontatoshomeopcoesitensselecionados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopovercontatoshomeopcoesitensselecionadosPageRoutingModule
  ],
  declarations: [PopovercontatoshomeopcoesitensselecionadosPage]
})
export class PopovercontatoshomeopcoesitensselecionadosPageModule {}
