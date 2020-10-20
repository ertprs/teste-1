import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfinrelselecionarPage } from './modalfinrelselecionar.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfinrelselecionarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfinrelselecionarPageRoutingModule {}
