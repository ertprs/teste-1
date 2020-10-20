import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewimagePage } from './viewimage.page';

const routes: Routes = [
  {
    path: '',
    component: ViewimagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewimagePageRoutingModule {}
