import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfiscalipisittributariaPage } from './modalfiscalipisittributaria.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfiscalipisittributariaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfiscalipisittributariaPageRoutingModule {}
