import { UserService } from 'src/app/services/global/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { NotificacoesService } from 'src/app/services/notificacoes/notificacoes.service';
import { Itnotificacoes } from 'src/app/interface/notificacoes/notificacoes';

import { ProcessosService } from 'src/app/services/design/processos.service';
import { TransferenciaService } from 'src/app/services/chat/transferencia.service';

import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ConversasService } from 'src/app/services/chat/conversas.service';

import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';

@Component({
  selector: 'app-aceite',
  templateUrl: './aceite.page.html',
  styleUrls: ['./aceite.page.scss'],
})
export class AceitePage implements OnInit {

  private dadosNotificacao : Itnotificacoes = {};
  @Input() notificacaoData: Itnotificacoes = {};

  private currentUser:any = {};
  private rejeicao:boolean = false;
  private motivoRejeicao:string = '';

  constructor(
    private design:ProcessosService,
    private nav:NavParams,
    private modal:ModalController,
    private router:Router,
    private serviceTransferencia:TransferenciaService,
    private notificacoesService:NotificacoesService,
    private contatoService:ContatosService,
    private conversaService:ConversasService,
    private afa:AngularFireAuth,
    private eventEmitterService: ProvEmitterEventService,
    private globalService:UserService
  ) { 
    this.currentUser = this.nav.get('currentUser');
    

    
    
  }

  ngOnInit() {

   
   
    this.serviceTransferencia.get(this.notificacaoData.tipoId).forEach(data => {
      this.dadosNotificacao = data;
     

    });
   
  }
  ngOnDestroy(){
    
  }
 
  closeModal() {
    console.log('Close modal')
      this.modal.dismiss();
  }
  async confirmAceiteTransferencia() {
    try {
      await this.design.presentLoading('Transferindo').then( resloading => {
        resloading.present();
        
        
        const notificacaoUpdate = {
          aceite: true,
          processar: true,          
          motivoRejeicao: ''
        }

        this.serviceTransferencia.update(this.notificacaoData.tipoId,notificacaoUpdate).then((res)=>{
          this.notificacoesService.update(this.notificacaoData.id,{finalizado:true}).then((res2)=>{
            
            this.design.presentToast(
              'Transferência Aceita',
              'success',
              3000
            );
            this.contatoService.getData(this.notificacaoData.contatoUid).then(data=>{          
              if(data.exists) {
                console.log(data.data());
                const contatoData = { id:data.id, ...data.data()};
                contatoData.usuarioUid = this.afa.auth.currentUser.uid;
                this.conversaService.startChat(contatoData).then(resStart=>{
                 
                  let conversaUid = this.dadosNotificacao.conversaUid;
             
                  this.functionExecute('chatConversaOpen',{contatoUid:resStart.contatoUid,conversaUid:conversaUid, situacao: resStart.situacao});
                  
                  resloading.dismiss();
                  this.modal.dismiss();
                }).catch(errStart=>{
                  console.log(errStart)
                  this.design.presentToast(
                    'Falha ao finalizar processo de traferencia',
                    'danger',
                    0,
                    true
                  )

                  resloading.dismiss();
                  this.modal.dismiss();
                });
              } else {
                this.design.presentToast(
                  'Não existe dados para transferencia',
                  'warning',
                  0,
                  true
                )
                resloading.dismiss();
                this.modal.dismiss();
              }
            }).catch(errStart=>{
              resloading.dismiss();
              this.modal.dismiss();
            });
            this.modal.dismiss();
          }).catch((err)=>{
            console.log(err)
            resloading.dismiss();
            this.design.presentToast(
              'Falha ao atualizar notificação',
              'danger',
              4000
            );
          });
        }).catch((err)=>{
          console.log(err)
          resloading.dismiss();
          this.design.presentToast(
            'Falha ao aceitar transferência',
            'danger',
            4000
          );
        });
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

  rejeitarTransferencia(decisao) {
    this.rejeicao = decisao;
  }
  RemoverConversaLista(convarsaUid:string)
  {
    let checkConversa = this.globalService.conversas.reduce( function( cur, val, index ){

      if( val.id === convarsaUid && cur === -1 ) {
              return index;
          }
          return cur;
      
      }, -1 );
      if(checkConversa >-1)
      {
        this.globalService.conversas.splice(checkConversa,1);
      }
  }
  async confirmRejeiteTransferencia() {
    try {
      await this.design.presentLoading('Transferindo').then( resloading => {
        resloading.present();
        
        const notificacaoUpdate = {
          aceite: false,
          motivoRejeicao: this.motivoRejeicao
        }
        
        this.serviceTransferencia.update(this.notificacaoData.tipoId,notificacaoUpdate).then((res)=>{
          this.notificacoesService.update(this.notificacaoData.id,{finalizado:true}).then((res)=>{

            const dadosNotDevolucao ={
              contatoUid:this.notificacaoData.contatoUid,
              finalizado:false,
              mensagem:this.afa.auth.currentUser.displayName+" Rejeitou sua transferencia. ",
              tipoId:this.notificacaoData.tipoId,
              titulo:"Transferência rejeitada"
            }
            
       
            this.notificacoesService.add(this.dadosNotificacao["usuarioOrigemUid"], dadosNotDevolucao)
            .then(resDevolucao=>{

             
              const dadosUpdadeConversa = {
                situacao:2,
                
                usuarioNome:this.dadosNotificacao["usuarioOrigemNome"],
                usuarioUid:this.dadosNotificacao["usuarioOrigemUid"]
              }
              
             

              this.conversaService.updateTransferencia(this.dadosNotificacao.conversaUid,dadosUpdadeConversa).then((res2)=>{
                this.RemoverConversaLista(this.dadosNotificacao.conversaUid);

                resloading.dismiss();
                this.design.presentToast(
                  'Transferência Rejeitada',
                  'success',
                  3000
                );
              })
              .catch(err2=>{
                resloading.dismiss();
                console.log(err2)
                this.design.presentToast(
                  'Falha ao rejeitar  solicitacao ',
                  'danger',
                  3000
                );
              })
              .finally(()=>{
                resloading.dismiss();
              })
             
              
            })
            .catch(errDevolucao=>{
              resloading.dismiss();
              console.log(errDevolucao)
            })
            .finally(()=>{
              resloading.dismiss();
              this.modal.dismiss();
            })


           
            
          }).catch((err)=>{
            console.log(err)
            resloading.dismiss();
            this.design.presentToast(
              'Falha ao atualizar notificação',
              'danger',
              4000
            );
          });
        }).catch((err)=>{
          resloading.dismiss();
          this.design.presentToast(
            'Falha ao rejeitar transferência',
            'danger',
            4000
          );
        });
      });
    } catch(err) {
      console.log(err);
      this.design.presentToast(
        "Falha ao tentar rejeitar transferência",
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
