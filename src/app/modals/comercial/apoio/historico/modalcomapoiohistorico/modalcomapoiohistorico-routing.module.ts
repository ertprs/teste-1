import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalcomapoiohistoricoPage } from './modalcomapoiohistorico.page';

const routes: Routes = [
  {
    path: '',
    component: ModalcomapoiohistoricoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalcomapoiohistoricoPageRoutingModule {}
