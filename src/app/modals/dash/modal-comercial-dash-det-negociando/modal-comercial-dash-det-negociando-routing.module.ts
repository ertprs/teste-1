import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalComercialDashDetNegociandoPage } from './modal-comercial-dash-det-negociando.page';

const routes: Routes = [
  {
    path: '',
    component: ModalComercialDashDetNegociandoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalComercialDashDetNegociandoPageRoutingModule {}
