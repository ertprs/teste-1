import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalgruposelecionarPage } from './modalgruposelecionar.page';

const routes: Routes = [
  {
    path: '',
    component: ModalgruposelecionarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalgruposelecionarPageRoutingModule {}
