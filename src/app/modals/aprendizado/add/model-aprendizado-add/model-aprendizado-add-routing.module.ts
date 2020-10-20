import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModelAprendizadoAddPage } from './model-aprendizado-add.page';

const routes: Routes = [
  {
    path: '',
    component: ModelAprendizadoAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelAprendizadoAddPageRoutingModule {}
