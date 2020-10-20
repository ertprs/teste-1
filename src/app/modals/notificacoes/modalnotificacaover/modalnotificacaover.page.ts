import { UserService } from 'src/app/services/global/user.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { NotificacoesService } from 'src/app/services/notificacoes/notificacoes.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modalnotificacaover',
  templateUrl: './modalnotificacaover.page.html',
  styleUrls: ['./modalnotificacaover.page.scss'],
})
export class ModalnotificacaoverPage implements OnInit {


  @Input() dados: any;
  constructor(
    private ctrlModal:ModalController,
    private srvNotificacao:NotificacoesService,
    private design:ProcessosService,
    private global:UserService

  ) { }
  
  closeModal(){
    this.ctrlModal.dismiss();
  }
  ngOnInit() {
    console.log(this.dados)
  }
  async delete(dados:any)
  {
    this.design.presentAlertConfirm(
      'Excluir',
      'Confirma Excluir este alerta ?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Excluindo...')
        .then(resLoadin=>{
          resLoadin.present()
          this.srvNotificacao.notDelete(dados.id)
          .then(resDelete=>{
            
            let checkNotificacao2 = this.global.notificacoes.reduce( function( cur, val, index ){

                if( val.id === dados.id && cur === -1 ) {
                    return index;
                }
                return cur;
            
            }, -1 );
            if(checkNotificacao2 > -1)
            {
              this.global.notificacoes.splice(checkNotificacao2,1);
            }

            this.design.presentToast(
              'Excluido com sucesso',
              'success',
              3000
            )
          
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao excluir',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoadin.dismiss()
          })
        })
      }
    })
  }
  async confirmVer(dados:any)
  {
    this.srvNotificacao.notMarcarComoLido(dados.id)
    .then(res=>{
      this.design.presentToast(
        'Confirmado',
        'success',
        3000
      )

      let checkNotificacao2 = this.global.notificacoes.reduce( function( cur, val, index ){

          if( val.id === dados.id && cur === -1 ) {
              return index;
          }
          return cur;
      
      }, -1 );
      if(checkNotificacao2 > -1)
      {
        this.global.notificacoes.splice(checkNotificacao2,1);
      }




    })
    .catch(err=>{
      console.log(err)
      this.design.presentToast(
        'Falha ao confirmar alerta',
        'danger',
        0,
        true
      )
    })
  }

}
