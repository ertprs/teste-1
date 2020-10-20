import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTransmissaoPage } from './add-transmissao.page';

const routes: Routes = [
  {
    path: '',
    component: AddTransmissaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTransmissaoPageRoutingModule {}
