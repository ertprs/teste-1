import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoveratdashfiltrosPage } from './popoveratdashfiltros.page';

const routes: Routes = [
  {
    path: '',
    component: PopoveratdashfiltrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoveratdashfiltrosPageRoutingModule {}
