import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalapoioconsultacidadePage } from './modalapoioconsultacidade.page';

const routes: Routes = [
  {
    path: '',
    component: ModalapoioconsultacidadePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalapoioconsultacidadePageRoutingModule {}
