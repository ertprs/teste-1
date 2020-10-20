import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PgTodoAddPageRoutingModule } from './pg-todo-add-routing.module';

import { PgTodoAddPage } from './pg-todo-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PgTodoAddPageRoutingModule
  ],
  declarations: [PgTodoAddPage]
})
export class PgTodoAddPageModule {}
