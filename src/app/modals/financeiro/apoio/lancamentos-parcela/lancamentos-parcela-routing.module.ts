import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LancamentosParcelaPage } from './lancamentos-parcela.page';

const routes: Routes = [
  {
    path: '',
    component: LancamentosParcelaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LancamentosParcelaPageRoutingModule {}
