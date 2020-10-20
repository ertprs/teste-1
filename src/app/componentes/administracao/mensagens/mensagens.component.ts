import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { AdministracaoMensagensService } from 'src/app/services/administracao/administracao-mensagens.service';
import { ItAdministracaoMensagens } from 'src/app/interface/administracao/it-administracao-mensagens';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.component.html',
  styleUrls: ['./mensagens.component.scss'],
})
export class MensagensComponent implements OnInit {

  // public mensagens = new Array<ItAdministracaoMensagens>();

  private messages : any = {
    daily: 0,
    monthly: 0,
    success: 0,
    failed: 0
  };
  private currentUser:any;
  private idCliente:string;

  private mensagens : ItAdministracaoMensagens[];
  private mensagensCounts : ItAdministracaoMensagens[];
  private mensagensSubscription : Subscription;
  private mensagensCardsSubscription : Subscription;
  
  constructor(
    private eventEmitterService : ProvEmitterEventService,
    // private admMensagensService : AdministracaoMensagensService,
    private auth : AuthService,
    ) { }

  ngOnInit() {
    this.currentUser = this.auth.getCUrrentUser();
    this.idCliente = this.currentUser.__zone_symbol__value.idCliente;
    this.loadStatistics();
  }

  ngOnDestroy(){
    // this.mensagensCardsSubscription.unsubscribe();
    // this.mensagensSubscription.unsubscribe();
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  loadStatistics(){
    // let dtFinal = this.admMensagensService.dataAtualFormatada().data.getTime();
    // let dtInicial = this.admMensagensService.dataAtualFormatada().data;
    // let dt2 = dtInicial.setDate(dtInicial.getDate()-1);

    // this.mensagensCardsSubscription = this.admMensagensService.listMensagens2().subscribe(res => {

    //   let [daily, monthly, success, failed] = [0, 0, 0, 0];

    //   res.forEach(mensagem => {
    //     mensagem['createAt'] >= dt2 && mensagem['createAt'] <= dtFinal ? daily++ : daily = daily;
        
    //     if(mensagem['status'] == 'falhou'){
    //       failed++;
    //     }
    //     else if(mensagem['status'] == 'completo') {
    //       success++;
    //     }
    //     monthly++;
    //   });
    //   this.messages = { daily: daily || 0, monthly: monthly || 0, success: success || 0, failed: failed || 0};
    // });

    this.listaRealtime();
  }

  async listaRealtime(){
    // this.mensagensSubscription = this.admMensagensService.listRealtime().subscribe(res => {
    //   this.mensagens = [];
      
    //   res.forEach(mensagem => {
    //     this.mensagens.push(mensagem);
    //   })
    // });
  }
}
