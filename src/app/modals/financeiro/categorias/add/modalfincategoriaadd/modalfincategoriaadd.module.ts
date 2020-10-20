import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfincategoriaaddPageRoutingModule } from './modalfincategoriaadd-routing.module';

import { ModalfincategoriaaddPage } from './modalfincategoriaadd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfincategoriaaddPageRoutingModule
  ],
  declarations: [ModalfincategoriaaddPage]
})
export class ModalfincategoriaaddPageModule {}
