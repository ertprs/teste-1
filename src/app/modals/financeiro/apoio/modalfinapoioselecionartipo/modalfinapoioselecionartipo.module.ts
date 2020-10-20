import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfinapoioselecionartipoPageRoutingModule } from './modalfinapoioselecionartipo-routing.module';

import { ModalfinapoioselecionartipoPage } from './modalfinapoioselecionartipo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfinapoioselecionartipoPageRoutingModule
  ],
  declarations: [ModalfinapoioselecionartipoPage]
})
export class ModalfinapoioselecionartipoPageModule {}
