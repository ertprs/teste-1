import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalapoioemailsendPageRoutingModule } from './modalapoioemailsend-routing.module';

import { ModalapoioemailsendPage } from './modalapoioemailsend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalapoioemailsendPageRoutingModule
  ],
  declarations: [ModalapoioemailsendPage]
})
export class ModalapoioemailsendPageModule {}
