import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalapoioconsultacidadePageRoutingModule } from './modalapoioconsultacidade-routing.module';

import { ModalapoioconsultacidadePage } from './modalapoioconsultacidade.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalapoioconsultacidadePageRoutingModule
  ],
  declarations: [ModalapoioconsultacidadePage]
})
export class ModalapoioconsultacidadePageModule {}
