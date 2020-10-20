import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalContatoImportPage } from './modal-contato-import.page';

const routes: Routes = [
  {
    path: '',
    component: ModalContatoImportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalContatoImportPageRoutingModule {}
