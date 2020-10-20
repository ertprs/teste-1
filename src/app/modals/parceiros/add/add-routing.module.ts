import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalParceiroAddPage } from './add.page';

const routes: Routes = [
  {
    path: '',
    component: ModalParceiroAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalParceiroAddPageRoutingModule {}
