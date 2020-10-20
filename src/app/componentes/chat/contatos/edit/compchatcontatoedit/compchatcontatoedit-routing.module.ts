import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompchatcontatoeditPage } from './compchatcontatoedit.page';

const routes: Routes = [
  {
    path: '',
    component: CompchatcontatoeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompchatcontatoeditPageRoutingModule {}
