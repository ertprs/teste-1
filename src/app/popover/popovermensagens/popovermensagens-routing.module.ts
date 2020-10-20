import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopovermensagensComponent } from './popovermensagens.component';

const routes: Routes = [
  {
    path: '',
    component: PopovermensagensComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopovermensagensComponentRoutingModule {}
