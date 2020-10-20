import { ModalController } from '@ionic/angular';
import { ListatransmissaoService } from 'src/app/services/chat/listatransmissao.service';
import { ProcessosService } from './../../../../services/design/processos.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-transmissao-detalhe',
  templateUrl: './modal-transmissao-detalhe.page.html',
  styleUrls: ['./modal-transmissao-detalhe.page.scss'],
})
export class ModalTransmissaoDetalhePage implements OnInit {
  @Input() listaUid: string;

  public dadosDetalhe = Array<{createAt,mensagem,wppErro,wppEnviado,wppAguardando,contatoData,errorMsg}>()
  constructor(
    private design:ProcessosService,
    private srvLista:ListatransmissaoService,
    private ctrlModel:ModalController
  ) { }
  closeModel(){
    this.ctrlModel.dismiss();
  }
  ngOnInit() {

  }
  ngAfterViewInit()
  {
    if(this.listaUid)
    {
      this.srvLista.getTransmissaoDetalheFirst(this.listaUid).subscribe(dados=>{
        this.dadosDetalhe = <any>dados
      })
    }
    else
    {
      this.design.presentToast(
        'Não existe uma lista especificada',
        'danger',
        0,
        true
      )
    }
  }

}
