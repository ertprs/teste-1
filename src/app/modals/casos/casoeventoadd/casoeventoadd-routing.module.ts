import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CasoeventoaddPage } from './casoeventoadd.page';

const routes: Routes = [
  {
    path: '',
    component: CasoeventoaddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CasoeventoaddPageRoutingModule {}
