import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashviewPageRoutingModule } from './dashview-routing.module';

import { DashviewPage } from './dashview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashviewPageRoutingModule
  ],
  declarations: [DashviewPage]
})
export class DashviewPageModule {}
