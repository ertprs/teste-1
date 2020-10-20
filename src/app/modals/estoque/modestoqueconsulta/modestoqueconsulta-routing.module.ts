import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModestoqueconsultaPage } from './modestoqueconsulta.page';

const routes: Routes = [
  {
    path: '',
    component: ModestoqueconsultaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModestoqueconsultaPageRoutingModule {}
