import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopovercontatoaddPage } from './popovercontatoadd.page';

const routes: Routes = [
  {
    path: '',
    component: PopovercontatoaddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopovercontatoaddPageRoutingModule {}
