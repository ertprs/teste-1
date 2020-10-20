import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalatfiltrosdataPage } from './modalatfiltrosdata.page';

const routes: Routes = [
  {
    path: '',
    component: ModalatfiltrosdataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalatfiltrosdataPageRoutingModule {}
