import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AtendimentoService } from 'src/app/services/configuracoes/atendimento.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { AnexosPage } from '../../chat/anexos/anexos.page';

@Component({
  selector: 'app-casoeventoadd',
  templateUrl: './casoeventoadd.page.html',
  styleUrls: ['./casoeventoadd.page.scss'],
})
export class CasoeventoaddPage implements OnInit {
  private dadosEvento = {
    privacidade:'private',
    tipo:'nota',
    descricao:'',
    es:'s',
    anexo:'',
    emailDestinatario:'',
    emailAssunto:''
  }
  constructor(
    private ctrlModal:ModalController,
    private design:ProcessosService
  ) { }

  ngOnInit() {
  }
  limparitens()
  {
    this.dadosEvento.anexo              = ''
    this.dadosEvento.privacidade        = ''
    this.dadosEvento.descricao          = ''
    this.dadosEvento.emailAssunto       = ''
    this.dadosEvento.emailDestinatario  = ''

  }
  addRegistro()
  {

    
    this.design.presentAlertConfirm(
      'Confirmação',
      'Pode mesmo adicionar este evento? Ele não poderá ser deletado depois.',
      'Pode',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.ctrlModal.dismiss({acao:'add',dados:this.dadosEvento})
      }
    })

   
  }

  async uploadDesk(){
    const modal = await this.ctrlModal.create({
      component: AnexosPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        origemChamada: 'listatransmissao'
      }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        if(data.data.link !== undefined) {
          this.dadosEvento.anexo = data.data.link;
        }
      }
    });

    await modal.present();
  }
  closeModal(){
    this.ctrlModal.dismiss()
  }
}
