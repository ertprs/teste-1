import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfinrecaddPage } from './modalfinrecadd.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfinrecaddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfinrecaddPageRoutingModule {}
