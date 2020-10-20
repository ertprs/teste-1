import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalComercialDashDetLeadsPage } from './modal-comercial-dash-det-leads.page';

const routes: Routes = [
  {
    path: '',
    component: ModalComercialDashDetLeadsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalComercialDashDetLeadsPageRoutingModule {}
