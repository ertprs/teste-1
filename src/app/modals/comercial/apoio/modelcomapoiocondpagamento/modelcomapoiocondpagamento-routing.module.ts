import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModelcomapoiocondpagamentoPage } from './modelcomapoiocondpagamento.page';

const routes: Routes = [
  {
    path: '',
    component: ModelcomapoiocondpagamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelcomapoiocondpagamentoPageRoutingModule {}
