import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeGrupoPage } from './home-grupo.page';

const routes: Routes = [
  {
    path: '',
    component: HomeGrupoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeGrupoPageRoutingModule {}
