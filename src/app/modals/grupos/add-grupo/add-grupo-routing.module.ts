import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddGrupoPage } from './add-grupo.page';

const routes: Routes = [
  {
    path: '',
    component: AddGrupoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddGrupoPageRoutingModule {}
