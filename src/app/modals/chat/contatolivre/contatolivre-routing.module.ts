import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContatolivrePage } from './contatolivre.page';

const routes: Routes = [
  {
    path: '',
    component: ContatolivrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContatolivrePageRoutingModule {}
