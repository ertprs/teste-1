import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';

@Component({
  selector: 'app-comchatlisthome',
  templateUrl: './comchatlisthome.component.html',
  styleUrls: ['./comchatlisthome.component.scss'],
})
export class ComchatlisthomeComponent implements OnInit {

  private itemsLista = []
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvContatos:ContatosService
  ) { }

  ngOnInit() {

    //CARREGAR LISTAS
    this.carregarListas()
  }
  async carregarListas()
  {
    this.srvContatos.listaTransmissaoGetAll().subscribe(element=>{
      if(!element.empty)
      {
        element.docs.forEach(elemReturn=>{
          const id = elemReturn.id
          const data = elemReturn.data()
          const dados = {
            id,
            ... data
          }
          this.itemsLista.push(dados)
        })
      }
    })
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
