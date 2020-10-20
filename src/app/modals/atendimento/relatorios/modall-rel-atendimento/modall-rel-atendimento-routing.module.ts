import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModallRelAtendimentoPage } from './modall-rel-atendimento.page';

const routes: Routes = [
  {
    path: '',
    component: ModallRelAtendimentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModallRelAtendimentoPageRoutingModule {}
