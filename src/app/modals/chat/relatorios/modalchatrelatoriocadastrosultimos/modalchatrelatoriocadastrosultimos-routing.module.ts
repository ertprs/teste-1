import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalchatrelatoriocadastrosultimosPage } from './modalchatrelatoriocadastrosultimos.page';

const routes: Routes = [
  {
    path: '',
    component: ModalchatrelatoriocadastrosultimosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalchatrelatoriocadastrosultimosPageRoutingModule {}
