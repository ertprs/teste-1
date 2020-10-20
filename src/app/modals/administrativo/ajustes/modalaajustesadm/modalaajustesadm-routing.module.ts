import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalaajustesadmPage } from './modalaajustesadm.page';

const routes: Routes = [
  {
    path: '',
    component: ModalaajustesadmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalaajustesadmPageRoutingModule {}
