import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AceitePage } from './aceite.page';

const routes: Routes = [
  {
    path: '',
    component: AceitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AceitePageRoutingModule {}
