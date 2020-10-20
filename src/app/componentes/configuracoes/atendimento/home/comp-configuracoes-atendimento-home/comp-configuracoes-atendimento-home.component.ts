import { AtendimentoService } from 'src/app/services/configuracoes/atendimento.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { Component, OnInit } from '@angular/core';
import { Itconfatendimento } from 'src/app/interface/configuracoes/itatendimento';
import { Router } from '@angular/router';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Subscription } from 'rxjs';
import { ModaluserselecionarPage } from 'src/app/modals/usuarios/modaluserselecionar/modaluserselecionar.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-comp-configuracoes-atendimento-home',
  templateUrl: './comp-configuracoes-atendimento-home.component.html',
  styleUrls: ['./comp-configuracoes-atendimento-home.component.scss'],
})
export class CompConfiguracoesAtendimentoHomeComponent implements OnInit {

  public atendimentoDados: Itconfatendimento = {};
  private itemsSubscriptionAdd: Subscription;

  constructor(
    private auth:AuthService,
    private desigin:ProcessosService,
    private atendimentoService:AtendimentoService,
    private router:Router,
    private eventEmitterService: ProvEmitterEventService,
    private ctrlModal:ModalController
  ) { 
    this.itemsSubscriptionAdd = new Subscription;
  }

  ngOnInit() {
    this.itemsSubscriptionAdd =  this.atendimentoService.get().subscribe(data => {     
      this.atendimentoDados = data;
      console.log(this.atendimentoDados);
    });
  }
  async abrirConsultaDeUsuario()
  {
  

    const modal = await this.ctrlModal.create({
      component: ModaluserselecionarPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        origem:'confatendimento'
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        this.atendimentoDados.usuarioChaveNome = dados.data.nome
        this.atendimentoDados.usuarioChaveUid = dados.data.uid
        
      }
    })

    await modal.present();
  }
  ngOnDestroy() {
    this.itemsSubscriptionAdd.unsubscribe();
  }

  atualizar() {
    this.desigin.presentLoading('Atualizando...').then(resLoading=>{
      resLoading.present();
      if(!this.atendimentoDados.hasOwnProperty('atdDom')) this.atendimentoDados.atdDom = false;
      if(!this.atendimentoDados.hasOwnProperty('atdSeg')) this.atendimentoDados.atdSeg = false;
      if(!this.atendimentoDados.hasOwnProperty('atdTer')) this.atendimentoDados.atdTer = false;
      if(!this.atendimentoDados.hasOwnProperty('atdQua')) this.atendimentoDados.atdQua = false;
      if(!this.atendimentoDados.hasOwnProperty('atdQui')) this.atendimentoDados.atdQui = false;
      if(!this.atendimentoDados.hasOwnProperty('atdSex')) this.atendimentoDados.atdSex = false;
      if(!this.atendimentoDados.hasOwnProperty('atdSab')) this.atendimentoDados.atdSab = false;
      console.log(this.atendimentoDados);
      // resLoading.dismiss();
      this.atendimentoService.update(this.atendimentoDados).then(res=>{
        resLoading.dismiss();
        this.desigin.presentToast(
          'Atualizado com sucesso',
          'success',
          3000
        );
      }).catch(err=>{
        resLoading.dismiss();
        console.log(err);
        this.desigin.presentToast(
          'Falha ao atualizar dados',
          'danger',
          4000
        );
      });
    });
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  checkDiaSemana(ev,campo) {
    let isChecked = ev.currentTarget.checked;
    console.log(isChecked);
    if(isChecked == false)
    {
      if (campo == 'atdSeg') {
          
        this.atendimentoDados.atdSeg = true;
        this.atendimentoDados.atdTer = true;
        this.atendimentoDados.atdQua = true;
        this.atendimentoDados.atdQui = true;
        this.atendimentoDados.atdSex = true;

      }
      else {
        if (this.atendimentoDados.atdSegHrIni != '00:00' && this.atendimentoDados.atdSegHrFim != '00:00') {
          this.atendimentoDados[`${campo}HrIni`] = this.atendimentoDados.atdSegHrIni;
          this.atendimentoDados[`${campo}HrFim`] = this.atendimentoDados.atdSegHrFim;
        }
      }

      this.atendimentoDados[campo] = false;
    }
    else
    {
      this.atendimentoDados[campo] = true;
      this.atendimentoDados[`${campo}HrIni`] = "00:00";
      this.atendimentoDados[`${campo}HrFim`] = "00:00";
    }
  }

}
