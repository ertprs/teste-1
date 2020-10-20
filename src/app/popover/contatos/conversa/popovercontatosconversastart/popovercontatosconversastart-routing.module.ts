import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopovercontatosconversastartPage } from './popovercontatosconversastart.page';

const routes: Routes = [
  {
    path: '',
    component: PopovercontatosconversastartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopovercontatosconversastartPageRoutingModule {}
