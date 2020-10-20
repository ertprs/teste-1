import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeGrupoPageRoutingModule } from './home-grupo-routing.module';

import { HomeGrupoPage } from './home-grupo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeGrupoPageRoutingModule
  ],
  declarations: [HomeGrupoPage]
})
export class HomeGrupoPageModule {}
