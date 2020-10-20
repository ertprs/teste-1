import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalchatconvhistoricobackupPage } from './modalchatconvhistoricobackup.page';

const routes: Routes = [
  {
    path: '',
    component: ModalchatconvhistoricobackupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalchatconvhistoricobackupPageRoutingModule {}
