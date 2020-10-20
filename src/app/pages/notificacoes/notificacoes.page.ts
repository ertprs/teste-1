import { Component, OnInit } from '@angular/core';

import { NotificacoesService } from 'src/app/services/notificacoes/notificacoes.service';
import { Itnotificacoes } from 'src/app/interface/notificacoes/notificacoes';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss'],
})
export class NotificacoesPage implements OnInit {

  private notificacoesSubscription: Subscription;
  private notificacoes = new Array<Itnotificacoes>();

  constructor(
    private notificacoesService:NotificacoesService
  ) { }

  ngOnInit() {
   
  }

  ngOnDestroy() {
   
  }

}
