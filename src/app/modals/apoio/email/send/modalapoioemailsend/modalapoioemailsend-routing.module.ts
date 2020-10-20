import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalapoioemailsendPage } from './modalapoioemailsend.page';

const routes: Routes = [
  {
    path: '',
    component: ModalapoioemailsendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalapoioemailsendPageRoutingModule {}
