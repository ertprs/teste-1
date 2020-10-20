import { Component, OnInit } from '@angular/core';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ServAtendimentoService } from 'src/app/services/atendimento/serv-atendimento.service';
import { map } from 'rxjs/operators';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';

@Component({
  selector: 'app-compwpptemplate',
  templateUrl: './compwpptemplate.component.html',
  styleUrls: ['./compwpptemplate.component.scss'],
})
export class CompwpptemplateComponent implements OnInit {

  private dadosTemplate = {
    texto:''
  }
  private items:[]
  constructor(
    private srvTemplate:ServAtendimentoService,
    private design:ProcessosService,
    private eventEmitterService: ProvEmitterEventService
  ) { }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  ngOnInit() {
    this.srvTemplate.wppTemplateGetAll()
    .then(dadosReturn=>{
      dadosReturn.subscribe(dados=>{
        this.items = <any>dados
      })
    })
    .catch(err=>{
      let msg = 'Falha no processo de leitura das templates | '+err
    })
  }

  delete(dados:any)
  {
    if(dados.aprovado )
    {
      this.design.presentToast(
        'Não foi possivel excluir. Esta mensagem já esta aprovada para utilização',
        'secondary',
        0,
        true
      )
    }
    else
    {
      this.design.presentAlertConfirm(
        'Excluir',
        'Você confirma excluir este modelo de mensagem?',
        'SIm',
        'Não'
      )
      .then(resConfirm=>{
        if(resConfirm)
        {
          this.design.presentLoading('Excluindo...')
          .then(resLoading=>{
            resLoading.present()
            this.srvTemplate.wppTemplateDelete(dados.id)
            .then(()=>{
              this.design.presentToast(
                'Modelo de mensagem deletado com sucesso',
                'success',
                3000
              )
            })
            .catch(err=>{
              let msg = 'Falha no processo de exclusão do modelo de mensagem | '+err
              console.log(msg)
              this.design.presentToast(
                msg,
                'danger',
                0,
                true
              )
            })
            .finally(()=>{
              resLoading.dismiss()
            })
          })
        }
      })
    }
  }

  adicionar()
  {
    if(this.dadosTemplate.texto.length > 100)
    {
      this.design.presentLoading('Inserindo...')
      .then(resLoading=>{
        resLoading.present()
        this.srvTemplate.wppTemplateAdd(this.dadosTemplate)
        .then(()=>{
          this.dadosTemplate.texto = '';
          this.design.presentToast(
            'Adicionada com sucesso',
            'success',
            3000
          )
        })
        .catch(err=>{
          let msg = 'Falha ao adicionar template wpp | '+err
          console.log(msg)
          this.design.presentToast(
            msg,
            'danger',
            0,
            true
          )
        })
        .finally(()=>{
          resLoading.dismiss()
        })
      })
    }
    else
    {
      this.design.presentToast(
        'Você não informou a quantidade mínima para adicionar um template. A Quantidade mínima é de 100 caracteres',
        'warning',
        0,
        true
      )
    }
  }
}
