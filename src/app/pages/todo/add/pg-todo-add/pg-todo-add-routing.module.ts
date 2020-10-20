import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PgTodoAddPage } from './pg-todo-add.page';

const routes: Routes = [
  {
    path: '',
    component: PgTodoAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PgTodoAddPageRoutingModule {}
