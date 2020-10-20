import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizarconversaPageRoutingModule } from './visualizarconversa-routing.module';

import { VisualizarconversaPage } from './visualizarconversa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizarconversaPageRoutingModule
  ],
  declarations: [VisualizarconversaPage]
})
export class VisualizarconversaPageModule {}
