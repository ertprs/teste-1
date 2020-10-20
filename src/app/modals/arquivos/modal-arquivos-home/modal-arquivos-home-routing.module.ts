import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalArquivosHomePage } from './modal-arquivos-home.page';

const routes: Routes = [
  {
    path: '',
    component: ModalArquivosHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalArquivosHomePageRoutingModule {}
