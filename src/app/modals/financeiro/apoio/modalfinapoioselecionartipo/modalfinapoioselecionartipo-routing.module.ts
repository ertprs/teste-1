import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfinapoioselecionartipoPage } from './modalfinapoioselecionartipo.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfinapoioselecionartipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfinapoioselecionartipoPageRoutingModule {}
