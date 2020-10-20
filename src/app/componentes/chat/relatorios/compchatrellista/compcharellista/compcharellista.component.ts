import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ListaTransmissaoService } from 'src/app/services/atendimento/lista-transmissao.service';

@Component({
  selector: 'app-compcharellista',
  templateUrl: './compcharellista.component.html',
  styleUrls: ['./compcharellista.component.scss'],
})
export class CompcharellistaComponent implements OnInit {


  public items = []
  public listTotal = 0;
  public listEnviados = 0;
  public listEntregues = 0;
  public listErro = 0;
  constructor(
    private eventEmitterService:ProvEmitterEventService,
    private srvlista:ListaTransmissaoService
  ) { 
    
  }

  ngOnInit() {
   
    this.srvlista.relGetDetalhes2().forEach(element=>{
      if(!element.empty)
      {
        this.listTotal = element.size
        let totEnviado = 0;
        let totalErro = 0;
        element.docs.forEach(dados=>{
          let data = dados.data();
          
          this.items.push(data)
          console.log(data)

          //TOTAliZADoreS
          if(data.wppTotal !== undefined)
          {
            let number1 = Number(data.wppTotal)
            totEnviado= totEnviado + number1
            console.log('Total ('+data.wppTotal+') ('+number1+') '+totEnviado)
          }

          if(data.wppErro !== undefined)
          {
            let number2 = Number(data.wppErro)
            totalErro= totalErro + number2
            console.log('Total ('+data.wppTotal+') ('+number2+') '+totEnviado)
          }
          
        })

        this.listEnviados = totEnviado
        this.listErro = totalErro
        let entregues = totEnviado - totalErro
        this.listEntregues =entregues
       
      }
     
    })

  }
  functionExecute(functionName:string,params:any)
  {
    const param = {
      function:functionName,
      data:params
    };
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

}
