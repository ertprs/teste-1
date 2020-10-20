import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectContatosPageRoutingModule } from './select-contatos-routing.module';

import { SelectContatosPage } from './select-contatos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectContatosPageRoutingModule
  ],
  declarations: [SelectContatosPage]
})
export class SelectContatosPageModule {}
