import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalenviarchatPage } from './modalenviarchat.page';

const routes: Routes = [
  {
    path: '',
    component: ModalenviarchatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalenviarchatPageRoutingModule {}
