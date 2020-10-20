import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfiscalncmaddPage } from './modalfiscalncmadd.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfiscalncmaddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfiscalncmaddPageRoutingModule {}
