import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Component, OnInit } from '@angular/core';
import { FiscalService } from 'src/app/service/fiscal/fiscal.service';

@Component({
  selector: 'app-comp-fiscal-home',
  templateUrl: './comp-fiscal-home.component.html',
  styleUrls: ['./comp-fiscal-home.component.scss'],
})
export class CompFiscalHomeComponent implements OnInit {

  constructor(
    private eventEmitterService:ProvEmitterEventService,
    private srvFiscal:FiscalService
  ) { }

  private notasLista = []
  ngOnInit() {
    this.ListarNotas()
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


  ListarNotas()
  {
    this.srvFiscal.notaGetAll().subscribe(elemNotas=>{
      if(!elemNotas.empty)
      {
        elemNotas.docs.forEach(dataReturn=>{
          const id = dataReturn.id
          const data = dataReturn.data()
          const dados = {
            id,
            ... data
          }
          console.log(dados)
          this.notasLista.push(dados)

        })
      }
    })
  }


}
