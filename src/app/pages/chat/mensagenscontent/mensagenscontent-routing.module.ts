import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MensagenscontentPage } from './mensagenscontent.page';

const routes: Routes = [
  {
    path: '',
    component: MensagenscontentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MensagenscontentPageRoutingModule {}
