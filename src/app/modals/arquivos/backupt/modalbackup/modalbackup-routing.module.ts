import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalbackupPage } from './modalbackup.page';

const routes: Routes = [
  {
    path: '',
    component: ModalbackupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalbackupPageRoutingModule {}
