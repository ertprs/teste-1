import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfiscalncmgerenciarPage } from './modalfiscalncmgerenciar.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfiscalncmgerenciarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfiscalncmgerenciarPageRoutingModule {}
