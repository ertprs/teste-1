import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopovercontatoshomeopcoesitensselecionadosPage } from './popovercontatoshomeopcoesitensselecionados.page';

const routes: Routes = [
  {
    path: '',
    component: PopovercontatoshomeopcoesitensselecionadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopovercontatoshomeopcoesitensselecionadosPageRoutingModule {}
