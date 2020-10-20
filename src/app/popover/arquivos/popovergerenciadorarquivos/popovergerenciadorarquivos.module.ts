import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopovergerenciadorarquivosPageRoutingModule } from './popovergerenciadorarquivos-routing.module';

import { PopovergerenciadorarquivosPage } from './popovergerenciadorarquivos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopovergerenciadorarquivosPageRoutingModule
  ],
  declarations: [PopovergerenciadorarquivosPage]
})
export class PopovergerenciadorarquivosPageModule {}
