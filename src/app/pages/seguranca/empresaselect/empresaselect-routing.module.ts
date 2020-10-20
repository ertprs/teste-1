import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpresaselectPage } from './empresaselect.page';

const routes: Routes = [
  {
    path: '',
    component: EmpresaselectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaselectPageRoutingModule {}
