import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncaminharPage } from './encaminhar.page';

const routes: Routes = [
  {
    path: '',
    component: EncaminharPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncaminharPageRoutingModule {}
