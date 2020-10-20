import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopovermensagemopcaoPage } from './popovermensagemopcao.page';

const routes: Routes = [
  {
    path: '',
    component: PopovermensagemopcaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopovermensagemopcaoPageRoutingModule {}
