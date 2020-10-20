import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastronovoPageRoutingModule } from './cadastronovo-routing.module';

import { CadastronovoPage } from './cadastronovo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastronovoPageRoutingModule
  ],
  declarations: [CadastronovoPage]
})
export class CadastronovoPageModule {}
