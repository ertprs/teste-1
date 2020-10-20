import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalheitemPage } from './detalheitem.page';

const routes: Routes = [
  {
    path: '',
    component: DetalheitemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalheitemPageRoutingModule {}
