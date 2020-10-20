import { UserService } from './../../../../services/global/user.service';
import { Component, OnInit } from '@angular/core';
import { TelegramService } from 'src/app/services/configuracoes/chat/telegram.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Telegram } from 'src/app/interface/configuracoes/chat/telegram';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';

@Component({
  selector: 'app-comp-telegram',
  templateUrl: './comp-telegram.component.html',
  styleUrls: ['./comp-telegram.component.scss'],
})
export class CompTelegramComponent implements OnInit {

  private dadosTelegram : Telegram = {};
  public  qtdConf: number = 0;
  public telegramSubscription: Subscription;
  public telegramSubscription2: Subscription;
  public dadosTelegramId: string = null;
  public items = new Array<Telegram>();
  public telegranId:string;
  public telegramToken:string;
  
  constructor(
    private serviceTelegram:TelegramService,
    private design:ProcessosService,
    public loadingController: LoadingController,
    private eventEmitterService: ProvEmitterEventService,
    private global:UserService
  ) { }

  async ngOnInit() {
    await this.design.presentLoading('Aguarde...')
    .then((res)=>{
      res.present();
      this.serviceTelegram.count()
      .then((res2)=>{
     
        this.loadData();
      })
      .catch(err=>{

      })
      .finally(()=>{
        res.dismiss();
      })
    })
   
   
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  loadData()
  {
    
    this.serviceTelegram.getAll()
    .then(res=>{
      console.log(res)
      this.telegranId = res.id;
      this.telegramToken = res.token;
    })
    .catch(err=>{
      console.log(err)
      
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
        this.serviceTelegram.delete(this.telegranId)
        .then(()=>{
          this.design.presentToast(
            'Seu sincronismo com Telegram foi desfeito',
            'success',
            3000
          );
        })
        .catch(err=>{
          console.log(err);
          this.design.presentToast(
            'Falha ao tentar excluir sincronismo',
            'danger',
            4000
          );
        });
      }
    })
    .catch((err)=>{
      console.log(err)
      this.design.presentToast(
        'Falha ao identificar sua confirmação',
        'danger',
        4000
      );
    });
  }

  async add()
  {
    let idCliente = this.global.dadosLogado.idCliente
    this.dadosTelegram.empresaUid = idCliente;
    this.dadosTelegram.token = this.telegramToken
    this.design.presentLoading('Sincronizando 2')
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
                  );
                })
                .catch((err)=>{
                  this.design.presentToast(
                    'Problemas ao gravar dados',
                    'danger',
                    6000
                  );
                })
                .finally(()=>{
                  res.dismiss();
                });
              }
              else
              {
                res.dismiss();
                this.design.presentToast(
                  res2["msg"],
                  'danger',
                  4000
                );
              }
            })
        })
        .catch((err)=>{
          this.design.presentToast(
            'Problemas ao tentar sincronizar Telegram. Tente novamente mais tarde',
            'danger',
            4000
          );
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
        );
      });
    


  }


  async sincronizar()
  { 
    this.add();
  }
}
