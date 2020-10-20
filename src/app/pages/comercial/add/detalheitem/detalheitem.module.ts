import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalheitemPageRoutingModule } from './detalheitem-routing.module';

import { DetalheitemPage } from './detalheitem.page';
import { NgxMaskIonicModule } from 'ngx-mask-ionic';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalheitemPageRoutingModule,
    NgxMaskIonicModule
  ],
  declarations: [DetalheitemPage]
})
export class DetalheitemPageModule {}
