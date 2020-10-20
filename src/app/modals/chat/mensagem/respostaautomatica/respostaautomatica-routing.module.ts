import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RespostaautomaticaPage } from './respostaautomatica.page';

const routes: Routes = [
  {
    path: '',
    component: RespostaautomaticaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RespostaautomaticaPageRoutingModule {}
