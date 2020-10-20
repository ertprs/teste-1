import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TelegramPage } from './telegram.page';

const routes: Routes = [
  {
    path: '',
    component: TelegramPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TelegramPageRoutingModule {}
