import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalaajustesadmPageRoutingModule } from './modalaajustesadm-routing.module';

import { ModalaajustesadmPage } from './modalaajustesadm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalaajustesadmPageRoutingModule
  ],
  declarations: [ModalaajustesadmPage]
})
export class ModalaajustesadmPageModule {}
