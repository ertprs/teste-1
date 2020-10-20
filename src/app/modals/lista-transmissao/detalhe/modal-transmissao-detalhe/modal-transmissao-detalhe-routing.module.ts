import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalTransmissaoDetalhePage } from './modal-transmissao-detalhe.page';

const routes: Routes = [
  {
    path: '',
    component: ModalTransmissaoDetalhePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalTransmissaoDetalhePageRoutingModule {}
