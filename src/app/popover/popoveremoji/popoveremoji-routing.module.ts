import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoveremojiPage } from './popoveremoji.page';

const routes: Routes = [
  {
    path: '',
    component: PopoveremojiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoveremojiPageRoutingModule {}
