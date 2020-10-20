import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AtendimentoService } from 'src/app/services/configuracoes/atendimento.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

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
  closeModal(){
    this.ctrlModal.dismiss()
  }
}
