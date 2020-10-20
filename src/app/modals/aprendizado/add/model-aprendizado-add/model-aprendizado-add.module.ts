import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModelAprendizadoAddPageRoutingModule } from './model-aprendizado-add-routing.module';

import { ModelAprendizadoAddPage } from './model-aprendizado-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModelAprendizadoAddPageRoutingModule
  ],
  declarations: [ModelAprendizadoAddPage]
})
export class ModelAprendizadoAddPageModule {}
