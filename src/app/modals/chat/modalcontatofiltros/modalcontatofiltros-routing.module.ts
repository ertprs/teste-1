import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalcontatofiltrosPage } from './modalcontatofiltros.page';

const routes: Routes = [
  {
    path: '',
    component: ModalcontatofiltrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalcontatofiltrosPageRoutingModule {}
