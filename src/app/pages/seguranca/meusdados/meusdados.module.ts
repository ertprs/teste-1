import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeusdadosPageRoutingModule } from './meusdados-routing.module';

import { MeusdadosPage } from './meusdados.page';
import { NgxMaskIonicModule } from 'ngx-mask-ionic';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeusdadosPageRoutingModule,
    ReactiveFormsModule,
    NgxMaskIonicModule
  ],
  declarations: [MeusdadosPage]
})
export class MeusdadosPageModule {}
