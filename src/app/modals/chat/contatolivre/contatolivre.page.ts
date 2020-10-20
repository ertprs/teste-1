import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { Router } from '@angular/router';

import { NotificacoesService } from 'src/app/services/notificacoes/notificacoes.service';
import { Itnotificacoes } from 'src/app/interface/notificacoes/notificacoes';

import { ProcessosService } from 'src/app/services/design/processos.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ConversasService } from 'src/app/services/chat/conversas.service';

import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';

@Component({
  selector: 'app-contatolivre',
  templateUrl: './contatolivre.page.html',
  styleUrls: ['./contatolivre.page.scss'],
})
export class ContatolivrePage implements OnInit {

  private dadosNotificacao : Itnotificacoes = {};

  private currentUser:any = {};
  private rejeicao:boolean = false;
  private motivoRejeicao:string = '';

  constructor(
    private design:ProcessosService,
    private nav:NavParams,
    private modal:ModalController,
    private router:Router,
    private contatoService:ContatosService,
    private conversaService:ConversasService,
    private notificacoesService:NotificacoesService,
    private eventEmitterService: ProvEmitterEventService
  ) { 
    this.currentUser = this.nav.get('currentUser');
    this.dadosNotificacao = this.nav.get('notificacaoData');
  }

  ngOnInit() {
    this.notificacoesService.update(this.dadosNotificacao.id,{finalizado:true}).then((res)=>{
    });
  }

  ngOnDestroy(){
    
  }

  closeModal() {
    this.modal.dismiss();
  }

  confirmContatoLivre() {
    try 
    {
      this.design.presentLoading('Chamando...').then( resloading => {
        resloading.present();

        this.contatoService.getData(this.dadosNotificacao.tipoId).then(data=>{          
          if(data.exists) {
        
            const contatoData = { id:data.id, ...data.data()};
            this.conversaService.startChat(contatoData).then(resStart=>{
              resloading.dismiss().then(()=>{
                this.modal.dismiss().then(()=>{
                  this.functionExecute('chatConversaOpen',{contatoUid:resStart.contatoUid,conversaUid:resStart.conversaUid})

                })
              })
              
              
              

             
            }).catch(errStart=>{
              console.log(errStart)
              resloading.dismiss();
              this.design.presentToast(
               'Falha ao iniciar conversa',
               'danger',
               0,
               true
             )
            })
            .finally(()=>{
              
            })
          } 
          else 
          {
            resloading.dismiss();
            this.modal.dismiss();
          }
        }).catch(errStart=>{
          resloading.dismiss();
          this.modal.dismiss();
        })
        
      });
    } catch(err) {
      console.log(err);
      this.design.presentToast(
        "Falha ao tentar aceitar transferência",
        "danger",
        4000
      )
    }
  }

  functionExecute(functionName:string,params:any)
  {
    console.log('preparando '+functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

}
