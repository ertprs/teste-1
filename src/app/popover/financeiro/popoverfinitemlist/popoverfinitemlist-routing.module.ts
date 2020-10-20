import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverfinitemlistPage } from './popoverfinitemlist.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverfinitemlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverfinitemlistPageRoutingModule {}
