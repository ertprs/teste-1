import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { GruposService } from 'src/app/services/chat/grupos.service';
import { Subscription } from 'rxjs';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Grupos } from 'src/app/interface/chat/grupos';

@Component({
  selector: 'app-add-grupo',
  templateUrl: './add-grupo.page.html',
  styleUrls: ['./add-grupo.page.scss'],
})
export class AddGrupoPage implements OnInit {

  @Input() grupoId: any;

  public gruposSubscription : Subscription;
  public dadosGrupo : Grupos = {};
  
  constructor(
    private nav:NavParams,
    public modal:ModalController,
    private eventEmitterService: ProvEmitterEventService,
    private gruposService : GruposService,
    private designProccess : ProcessosService,
  ) { }

  ngOnInit() {

    if (this.grupoId){
      try
      {
        this.gruposSubscription = this.gruposService.get(this.grupoId).subscribe(data => {
          this.dadosGrupo = data;
        });
      }
      catch(err)
      {
        console.log('Falha ao registrar subscribe de contatos ');
      }
    }
    else
    {
      console.log('Novo contato '+this.grupoId);
    }
  }

  ngOnDestroy(){
    this.gruposSubscription.unsubscribe();
  }

  functionExecute(functionName:string,params:any)
  {
    console.log(params);
    console.log('preparando '+functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  closeModal(){
    this.modal.dismiss();
  }

  async grupoAdd(){

    if (this.grupoId) {

      await this.designProccess.presentLoading('Atualizando...')
      .then((res)=>
      {
        res.present();
        this.gruposService.update(this.grupoId, this.dadosGrupo)
        .then(()=>{
          this.designProccess.presentToast(
            'Alterado com sucesso',
            'success',
            3000
            );
        })
        .catch((err)=>{
          this.designProccess.presentToast(
            'Falha ao atualizar grupo '+err,
            'danger',
            4000
          );
        })
        .finally(()=>{
          res.dismiss();
          this.modal.dismiss();
        });
      });

    }
    else
    {
      this.gruposService.add(this.dadosGrupo)
      .then(()=>{
        this.designProccess.presentToast(
          'Cadastrado com sucesso!',
          'success',
          3000
        );
        this.functionExecute('chatContatoHome',{});
      })
      .catch((err)=>{
        console.log(err)
        if(err.code == 1)
        { 
          this.designProccess.presentToast(
            err.msg,
            'warning',
            0,
            true
          );
        }
        else
        { 
          this.designProccess.presentToast(
            'Falha ao cadastrar '+err,
            'danger',
            4000,
            true
          )
        }
      });
    }
  }

  async grupoDelete(){
    await this.designProccess.presentAlertConfirm(
      'Excluir!',
      'Posso excluir esta lista?',
      "Pode!",
      "Nem pensar..."
    )
    .then((resp)=>
    {
      
      if(resp)
      {
        //OK
        this.gruposService.delete(this.grupoId)
        .then(()=>{
          this.designProccess.presentToast(
            'Lista de Transmissão deletada com sucesso ',
            'success',
            3000
          );
          // this.modal.dismiss();
          this.functionExecute('chatContatoHome',{});
        })
        .catch((err)=>{
          this.designProccess.presentToast(
            'Falha ao deletar lista de transmissão '+err,
            'success',
            3000
          );
        });
      }

    })
    .catch(()=>{

    })
  }
}
