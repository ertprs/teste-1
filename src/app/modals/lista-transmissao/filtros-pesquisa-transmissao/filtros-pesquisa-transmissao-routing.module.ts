import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiltrosPesquisaTransmissaoPage } from './filtros-pesquisa-transmissao.page';

const routes: Routes = [
  {
    path: '',
    component: FiltrosPesquisaTransmissaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiltrosPesquisaTransmissaoPageRoutingModule {}
