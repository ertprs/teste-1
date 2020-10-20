import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddGrupoPageRoutingModule } from './add-grupo-routing.module';

import { AddGrupoPage } from './add-grupo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddGrupoPageRoutingModule
  ],
  declarations: [AddGrupoPage]
})
export class AddGrupoPageModule {}
