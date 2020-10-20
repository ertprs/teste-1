import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalcontatoconsultaPage } from './modalcontatoconsulta.page';

const routes: Routes = [
  {
    path: '',
    component: ModalcontatoconsultaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalcontatoconsultaPageRoutingModule {}
