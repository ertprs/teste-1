import { ServAtendimentoCasosService } from './../../../../../services/configuracoes/atendimento/casos/serv-atendimento-casos.service';
import { ServAtendimentoDepartamentoService } from './../../../../../services/configuracoes/atendimento/departamento/serv-atendimento-departamento.service';
import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';

@Component({
  selector: 'app-compatendimentocasosfluxo',
  templateUrl: './compatendimentocasosfluxo.component.html',
  styleUrls: ['./compatendimentocasosfluxo.component.scss'],
})
export class CompatendimentocasosfluxoComponent implements OnInit {

  public itemsDepartamento = []
  public itemsTipo = []
  public dados = {departamento:'',tipo:''}
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvDepartamento:ServAtendimentoDepartamentoService,
    private srvCases:ServAtendimentoCasosService
  ) { }
  
  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  ngOnInit() {
  
    this.srvDepartamento.getAll().subscribe(dados=>{
      this.itemsDepartamento = dados
    })

    

  }
  setDepartamento(){
    this.dados.tipo = '';
    this.srvCases.getAllPorDepartamento(this.dados.departamento).subscribe(dados=>{
      this.itemsTipo = dados
    })
  }

}
