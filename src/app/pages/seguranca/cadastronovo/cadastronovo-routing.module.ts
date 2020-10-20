import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastronovoPage } from './cadastronovo.page';

const routes: Routes = [
  {
    path: '',
    component: CadastronovoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastronovoPageRoutingModule {}
