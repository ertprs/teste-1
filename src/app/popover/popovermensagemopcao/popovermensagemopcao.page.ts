import { Component, OnInit } from '@angular/core';
import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';

import { RespostaautomaticaPage } from 'src/app/modals/chat/mensagem/respostaautomatica/respostaautomatica.page';

@Component({
  selector: 'app-popovermensagemopcao',
  templateUrl: './popovermensagemopcao.page.html',
  styleUrls: ['./popovermensagemopcao.page.scss'],
})
export class PopovermensagemopcaoPage implements OnInit {

  private currentUser:object = {};
  private dadosMensagem:object = {};

  constructor(
    private mensagensService: MensagensService,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private nav:NavParams,
  ) 
  { 
    
  }

  ngOnInit() {
    this.currentUser = this.nav.get('currentUser');
    this.dadosMensagem = this.nav.get('dadosMensagem');
  }
  
  activeForward(tipo:string) {
    //this.mensagensService.forwardMessage();
    this.popoverController.dismiss(tipo);
  }

  async modalCreate()
  {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: RespostaautomaticaPage,
      mode: 'ios',
    
      showBackdrop: true,
      
      cssClass: 'selector-modal',
      componentProps: {
        currentUser: this.currentUser,
        dadosMensagem: this.dadosMensagem
      }
    });
    await modal.present();
  }

}
