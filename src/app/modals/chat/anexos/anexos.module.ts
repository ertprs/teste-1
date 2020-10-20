
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnexosPageRoutingModule } from './anexos-routing.module';

import { AnexosPage } from './anexos.page';
import { UploadTaskComponent } from './../../../componentes/upload/upload-task/upload-task.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnexosPageRoutingModule,
    
  ],
  declarations: [AnexosPage,UploadTaskComponent]
})
export class AnexosPageModule {}
