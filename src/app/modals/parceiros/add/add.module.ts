import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalParceiroAddPageRoutingModule } from './add-routing.module';

import { ModalParceiroAddPage } from './add.page';
import { NgxMaskIonicModule } from 'ngx-mask-ionic';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalParceiroAddPageRoutingModule,
    ReactiveFormsModule,
    NgxMaskIonicModule
  ],
  declarations: [ModalParceiroAddPage]
})
export class ModalParceiroAddPageModule {}
