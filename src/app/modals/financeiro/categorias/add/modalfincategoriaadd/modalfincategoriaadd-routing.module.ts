import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfincategoriaaddPage } from './modalfincategoriaadd.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfincategoriaaddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfincategoriaaddPageRoutingModule {}
