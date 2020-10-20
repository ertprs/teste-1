import { Component, OnInit } from '@angular/core';
import { Geral } from 'src/app/interface/configuracoes/geral';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { GeralService } from 'src/app/services/configuracoes/geral.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { UserService } from 'src/app/services/global/user.service';

@Component({
  selector: 'app-geral',
  templateUrl: './geral.component.html',
  styleUrls: ['./geral.component.scss'],
})
export class ConfigGeralComponent implements OnInit {

  private dadosGerais : Geral = {};
  private timeoutActive : boolean = false;
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private geral : GeralService,
    private design : ProcessosService,
    private globalUser:UserService,
  ) { }

  ngOnInit() {
    this.load();
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  load(){
    const idCliente = this.globalUser.dadosLogado.idCliente;
    this.geral.get(idCliente).subscribe(data => { 
      if(data.exists)
      {
        const dados = data.data()
        this.dadosGerais = dados
      }
    })
  }

  gravar(){

    if(this.dadosGerais.timeout < 15)
    {
      this.design.presentToast(
        'O tempo mínimo deve ser de 15 minutos',
        'secondary',
        0,
        true
      )
      return false
    }



    this.design.presentLoading('Atualizando...').then(resLoading=>{
      resLoading.present();

      this.geral.update(this.dadosGerais).then(res=>{
        resLoading.dismiss();
        this.design.presentToast(
          'Atualizado com sucesso',
          'success',
          3000
        );
      }).catch(err=>{
        resLoading.dismiss();
        console.log(err);
        this.design.presentToast(
          'Falha ao atualizar dados',
          'danger',
          4000
        );
      });
    });
  }
}
