import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalnotificacaoverPage } from './modalnotificacaover.page';

const routes: Routes = [
  {
    path: '',
    component: ModalnotificacaoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalnotificacaoverPageRoutingModule {}
