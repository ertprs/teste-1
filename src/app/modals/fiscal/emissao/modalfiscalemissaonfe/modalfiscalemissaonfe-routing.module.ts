import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfiscalemissaonfePage } from './modalfiscalemissaonfe.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfiscalemissaonfePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfiscalemissaonfePageRoutingModule {}
