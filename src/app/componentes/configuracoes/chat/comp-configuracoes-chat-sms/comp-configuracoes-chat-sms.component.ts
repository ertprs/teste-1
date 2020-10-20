import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sms } from 'src/app/interface/configuracoes/chat/sms';
import { SmsService } from 'src/app/services/configuracoes/chat/sms.service';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-comp-configuracoes-chat-sms',
  templateUrl: './comp-configuracoes-chat-sms.component.html',
  styleUrls: ['./comp-configuracoes-chat-sms.component.scss'],
})
export class CompConfiguracoesChatSmsComponent implements OnInit {

  public dadosConf :Sms = {};
  public confSubscription: Subscription;

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private smsService:SmsService,
    private design : ProcessosService
  ) { 
    this.confSubscription = new Subscription;
  }

  ngOnInit() {
    
    this.confSubscription = this.smsService.get().subscribe(elem=>{
      this.dadosConf = elem[0];
    });
    
  }

  ngOnDestroy(){
    this.confSubscription.unsubscribe();
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  add() {
    this.design.presentLoading('Gravando dados...').then(resLoading=>{
      resLoading.present();
      this.smsService.add(this.dadosConf).then(res=>{
        this.dadosConf.id = res.id;
        this.design.presentToast(
          'Sms configurado com sucesso',
          'success',
          3000
        );
      }).catch(err=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao configurar sms',
          'danger',
          4000
        );
      }).finally(() => {
        resLoading.dismiss();
      }) 
    });
  }

  update() {
    this.design.presentLoading('Gravando dados...').then(resLoading=>{
      resLoading.present();
      this.smsService.update(this.dadosConf.id,this.dadosConf).then(res=>{
        this.design.presentToast(
          'Sms configurado com sucesso',
          'success',
          3000
        );
      }).catch(err=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao configurar sms',
          'danger',
          4000
        );
      }).finally(() => {
        resLoading.dismiss();
      }) 
    });
  }

}
