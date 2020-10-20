import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContatolivrePageRoutingModule } from './contatolivre-routing.module';

import { ContatolivrePage } from './contatolivre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContatolivrePageRoutingModule
  ],
  declarations: [ContatolivrePage]
})
export class ContatolivrePageModule {}
