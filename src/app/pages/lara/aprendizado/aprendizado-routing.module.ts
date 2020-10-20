import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AprendizadoPage } from './aprendizado.page';

const routes: Routes = [
  {
    path: '',
    component: AprendizadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AprendizadoPageRoutingModule {}
