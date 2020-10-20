import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { AtendimentoService } from 'src/app/services/configuracoes/atendimento.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-compmssgautomatica',
  templateUrl: './compmssgautomatica.component.html',
  styleUrls: ['./compmssgautomatica.component.scss'],
})
export class CompmssgautomaticaComponent implements OnInit {

  public dadosMensagens = {
    msgAniversariante:'',
    msgBoasVindas :''
  }
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvAtendimento:AtendimentoService,
    private design:ProcessosService
  ) { }

  ngOnInit() {

    this.getMensagens()
  }
  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  async getMensagens(){
    this.srvAtendimento.getAll().forEach(elem=>{
      if(elem.exists)
      {
        const id = elem.id
        const data = elem.data()
        
        this.dadosMensagens.msgAniversariante = data.msgAniversariante
        this.dadosMensagens.msgBoasVindas = data.msgBoasVindas
      }
    })
  }
  atualizar(dadosMensagens:any)
  {
    this.srvAtendimento.updateMsgAuto(dadosMensagens)
    .then(res=>{
      this.design.presentToast(
        'Atualizado com sucesso.',
        'success',
        3000,
        false
      )
    })
    .catch(err=>{
      console.log(err)
      this.design.presentToast(
        'Falha ao atualizar dados',
        'danger',
        0,
        true
      )
    })
  }

}
