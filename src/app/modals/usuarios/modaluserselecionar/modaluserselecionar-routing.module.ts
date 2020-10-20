import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModaluserselecionarPage } from './modaluserselecionar.page';

const routes: Routes = [
  {
    path: '',
    component: ModaluserselecionarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModaluserselecionarPageRoutingModule {}
