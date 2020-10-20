import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalpedidoenviarPage } from './modalpedidoenviar.page';

const routes: Routes = [
  {
    path: '',
    component: ModalpedidoenviarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalpedidoenviarPageRoutingModule {}
