import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectContatosPage } from './select-contatos.page';

const routes: Routes = [
  {
    path: '',
    component: SelectContatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectContatosPageRoutingModule {}
