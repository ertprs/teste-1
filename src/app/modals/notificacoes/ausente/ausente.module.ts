import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AusentePageRoutingModule } from './ausente-routing.module';

import { AusentePage } from './ausente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AusentePageRoutingModule
  ],
  declarations: [AusentePage]
})
export class AusentePageModule {}
