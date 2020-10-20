import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeditemeditPage } from './peditemedit.page';

const routes: Routes = [
  {
    path: '',
    component: PeditemeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeditemeditPageRoutingModule {}
