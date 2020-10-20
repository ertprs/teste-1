import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfiscalicmssittributariaPage } from './modalfiscalicmssittributaria.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfiscalicmssittributariaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfiscalicmssittributariaPageRoutingModule {}
