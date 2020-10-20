import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashviewPage } from './dashview.page';

const routes: Routes = [
  {
    path: '',
    component: DashviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashviewPageRoutingModule {}
