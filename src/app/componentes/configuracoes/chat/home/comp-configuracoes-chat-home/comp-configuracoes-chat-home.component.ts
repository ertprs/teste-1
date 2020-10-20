import { ConfempresaService } from 'src/app/services/configuracoes/confempresa.service';
import { Component, OnInit } from '@angular/core';
import { Itempresaconf } from 'src/app/interface/empresa/itempresaconf';
import { Subscription } from 'rxjs';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';

@Component({
  selector: 'app-comp-configuracoes-chat-home',
  templateUrl: './comp-configuracoes-chat-home.component.html',
  styleUrls: ['./comp-configuracoes-chat-home.component.scss'],
})
export class CompConfiguracoesChatHomeComponent implements OnInit {

  public dadosConf :Itempresaconf = {};
  public confSubscription: Subscription;
  constructor(
    public serviceConfEmpresa:ConfempresaService,
    private eventEmitterService: ProvEmitterEventService
  ) { 
    this.confSubscription = new Subscription;
  }

  ngOnInit() {
    try{
      this.confSubscription = this.serviceConfEmpresa.getCofiguracoes().subscribe(elem=>{
        this.dadosConf = elem
      })
    }
    catch(err)
    {
      console.log(err);
    }
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

}
