import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalchatlistarelPage } from './modalchatlistarel.page';

const routes: Routes = [
  {
    path: '',
    component: ModalchatlistarelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalchatlistarelPageRoutingModule {}
