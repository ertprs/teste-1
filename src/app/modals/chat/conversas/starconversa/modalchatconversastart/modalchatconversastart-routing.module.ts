import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalchatconversastartPage } from './modalchatconversastart.page';

const routes: Routes = [
  {
    path: '',
    component: ModalchatconversastartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalchatconversastartPageRoutingModule {}
