import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfiscalcofinssittributariaPage } from './modalfiscalcofinssittributaria.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfiscalcofinssittributariaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfiscalcofinssittributariaPageRoutingModule {}
