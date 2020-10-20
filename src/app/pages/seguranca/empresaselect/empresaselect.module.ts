import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpresaselectPageRoutingModule } from './empresaselect-routing.module';

import { EmpresaselectPage } from './empresaselect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpresaselectPageRoutingModule
  ],
  declarations: [EmpresaselectPage]
})
export class EmpresaselectPageModule {}
