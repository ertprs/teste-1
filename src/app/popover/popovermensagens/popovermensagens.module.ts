import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopovermensagensComponentRoutingModule } from './popovermensagens-routing.module';

import { PopovermensagensComponent } from './popovermensagens.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopovermensagensComponentRoutingModule
  ],
  declarations: [PopovermensagensComponent]
})
export class PopovermensagensComponentModule {}
