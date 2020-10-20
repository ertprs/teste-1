import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfiscalpissittributariaPage } from './modalfiscalpissittributaria.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfiscalpissittributariaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfiscalpissittributariaPageRoutingModule {}
