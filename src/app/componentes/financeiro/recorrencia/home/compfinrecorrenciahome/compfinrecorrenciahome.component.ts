import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalfinrecaddPage } from 'src/app/modals/financeiro/recorrencia/add/modalfinrecadd/modalfinrecadd.page';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { LancamentoService } from 'src/app/services/financeiro/lancamento.service';

@Component({
  selector: 'app-compfinrecorrenciahome',
  templateUrl: './compfinrecorrenciahome.component.html',
  styleUrls: ['./compfinrecorrenciahome.component.scss'],
})
export class CompfinrecorrenciahomeComponent implements OnInit {

  private recorrenciaItens = []

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private ctrlModal:ModalController,
    private srvLancamento:LancamentoService,
    private design:ProcessosService
  ) { }

  ngOnInit() {

  
  this.srvLancamento.recorrenciaGetAll().forEach(element=>{
    this.recorrenciaItens = []
    element.forEach(dados => {
     
   
      this.recorrenciaItens.push(dados)
    });
    
  })

  

  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }


  async deleteRecorrencia(item:any)
  {
    this.design.presentAlertConfirm(
      'Excluir',
      'Confirma excluir recorrência?'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        if(item.qtdProcessos > 0)
        {
          this.design.presentToast(
            'Você não pode excluir esta recorrência porque já ocorreram processos',
            'warning',
            0,
            true
          )
        }
        else
        {
          this.design.presentLoading('Excluindo...')
          .then(resLoading=>{
            resLoading.present()

            this.srvLancamento.recorrenciaDelete(item.id)
            .then(resDelete=>{
              this.design.presentToast(
                "Excluido com sucesso",
                'success',
                3000
              )
            })
            .catch(errDelete=>{
              console.log(errDelete)
              this.design.presentToast(
                'Falha ao tentar excluir recorrência',
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
      }
    })
  }
  async abrirRecorrencia(uid?:string)
  {
    const modal = await this.ctrlModal.create({
      component: ModalfinrecaddPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
  
      componentProps: {
        origem:'homefimrecorrencia',
        uid
      }
    });
    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        if(dados.data.acao == 'filtrar')
        {
        
          
       
        }
      }
    })
    await modal.present();
  }

 

}
