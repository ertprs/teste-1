import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModestoqueconsultaPageRoutingModule } from './modestoqueconsulta-routing.module';

import { ModestoqueconsultaPage } from './modestoqueconsulta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModestoqueconsultaPageRoutingModule
  ],
  declarations: [ModestoqueconsultaPage]
})
export class ModestoqueconsultaPageModule {}
