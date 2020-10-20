import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AusentePage } from './ausente.page';

const routes: Routes = [
  {
    path: '',
    component: AusentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AusentePageRoutingModule {}
