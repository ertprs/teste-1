import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverhomemenuPage } from './popoverhomemenu.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverhomemenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverhomemenuPageRoutingModule {}
