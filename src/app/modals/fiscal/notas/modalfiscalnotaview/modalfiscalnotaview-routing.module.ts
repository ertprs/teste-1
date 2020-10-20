import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfiscalnotaviewPage } from './modalfiscalnotaview.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfiscalnotaviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfiscalnotaviewPageRoutingModule {}
