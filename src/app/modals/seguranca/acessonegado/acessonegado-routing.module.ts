import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcessonegadoPage } from './acessonegado.page';

const routes: Routes = [
  {
    path: '',
    component: AcessonegadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcessonegadoPageRoutingModule {}
