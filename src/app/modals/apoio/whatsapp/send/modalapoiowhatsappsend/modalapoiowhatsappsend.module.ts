import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalapoiowhatsappsendPageRoutingModule } from './modalapoiowhatsappsend-routing.module';

import { ModalapoiowhatsappsendPage } from './modalapoiowhatsappsend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalapoiowhatsappsendPageRoutingModule
  ],
  declarations: [ModalapoiowhatsappsendPage]
})
export class ModalapoiowhatsappsendPageModule {}
