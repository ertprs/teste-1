import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomedeskPage } from './homedesk.page';

const routes: Routes = [
  {
    path: '',
    component: HomedeskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomedeskPageRoutingModule {}
