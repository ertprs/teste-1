import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { NotificacoesService } from 'src/app/services/notificacoes/notificacoes.service';
import { Itnotificacoes } from 'src/app/interface/notificacoes/notificacoes';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.page.html',
  styleUrls: ['./aviso.page.scss'],
})
export class AvisoPage implements OnInit {

  private dadosNotificacao : Itnotificacoes = {};

  private currentUser:any = {};

  constructor(
    private nav:NavParams,
    private modal:ModalController,
    private notificacoesService:NotificacoesService
  ) { 
    this.currentUser = this.nav.get('currentUser');
    this.dadosNotificacao = this.nav.get('notificacaoData');
  }

  ngOnInit() {
    this.notificacoesService.update(this.dadosNotificacao.id,{finalizado:true}).then((res)=>{
    });
  }

  okayConfirm() {
    this.modal.dismiss();
  }

}
