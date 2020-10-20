import { ProcessosService } from 'src/app/services/design/processos.service';

import { Component, OnInit } from '@angular/core';
import { TelegramService } from 'src/app/services/configuracoes/chat/telegram.service';
import { Telegram } from './../../../../interface/configuracoes/chat/telegram';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-telegram',
  templateUrl: './telegram.page.html',
  styleUrls: ['./telegram.page.scss'],
})
export class TelegramPage implements OnInit {

  private dadosTelegram : Telegram = {};
  public  qtdConf: number = 0;
  public telegramSubscription: Subscription;
  public dadosTelegramId: string = '';
  public items = new Array<Telegram>();

  constructor(
    private serviceTelegram:TelegramService,
    private design:ProcessosService,
    public loadingController: LoadingController,
  
  ) { 

    
  }
  
  loadData()
  {
    this.telegramSubscription = this.serviceTelegram.get().subscribe(data => {
     
      data.forEach(elem=>{

        this.dadosTelegram = elem;
        this.dadosTelegramId = elem.id
      })
      console.log(data);
     
    });
  }

  async ngOnInit() {
    await this.design.presentLoading('Aguarde...')
    .then((res)=>{
      res.present()
       this.serviceTelegram.count()
       .then((res2)=>{
         res.dismiss();
         if(res2 > 0)
         {
           this.qtdConf  = res2;
           //DEU CERTO
           this.loadData();
         }
         else
         {
           //DEU ERRADO
         }
       })
    })
    .catch((err)=>{
      //DEU ERRADO
    })
  
  }

delete()
{
  this.design.presentAlertConfirm('Confirma desfazer sincronismo?',
  'Você não irá mais receber mensagens de seu BOT',
  'Pode fazer!',
  'Melhor não')
  .then(res=>{
    if(res)
    {
      this.serviceTelegram.delete(this.dadosTelegramId)
      .then(()=>{
        this.design.presentToast(
          'Seu sincronismo com Telegram foi desfeito',
          'success',
          3000
        )
      })
      .catch(err=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao tentar excluir sincronismo',
          'danger',
          4000
        )
      })
    }
  })
  .catch((err)=>{
    console.log(err)
    this.design.presentToast(
      'Falha ao identificar sua confirmação',
      'danger',
      4000
    )
  })
}

 async add()
 {
   this.design.presentLoading('Sincronizando')
   .then(async resLoading=>{
      resLoading.present();
      await this.design.presentLoading('Validando conexão')
      .then((res)=>{
        res.dismiss();
          this.serviceTelegram.setWebHook(this.dadosTelegram)
          
        .then((res2)=>{
          
          if(res2["situacao"] == "suc")
          {
  
            this.serviceTelegram.add(this.dadosTelegram)
            .then((res3)=>{
              this.design.presentToast(
                'Telegam sincronizado com sucesso',
                'success',
                3000
              )
            })
            .catch((err)=>{
              this.design.presentToast(
                'Problemas ao gravar dados',
                'danger',
                6000
              )
            })
            .finally(()=>{
              res.dismiss();
            })
            
  
            
           
          }
          else
          {
            res.dismiss();
            this.design.presentToast(
              res2["msg"],
              'danger',
              4000
            )
          }
        })
      })
      .catch((err)=>{
        this.design.presentToast(
          'Problemas ao tentar sincronizar Telegram. Tente novamente mais tarde',
          'danger',
          4000
        )
      })
      .finally(()=>{
        resLoading.dismiss();
      })
   })
   .catch(err=>{
     console.log(err)
     this.design.presentToast(
       'Falha ao processar sincronismo. Tente novamente mais tarde',
       'danger',
       4000
     )
   })
 
 }

 
  async sincronizar()
  { 
    this.add();
  }

}

