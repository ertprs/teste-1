import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewimagePageRoutingModule } from './viewimage-routing.module';

import { ViewimagePage } from './viewimage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewimagePageRoutingModule
  ],
  declarations: [ViewimagePage]
})
export class ViewimagePageModule {}
