import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizarconversaPage } from './visualizarconversa.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizarconversaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizarconversaPageRoutingModule {}
