import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Mensagens } from 'src/app/interface/chat/mensagens';
import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';

@Component({
  selector: 'app-modalapoiowhatsappsend',
  templateUrl: './modalapoiowhatsappsend.page.html',
  styleUrls: ['./modalapoiowhatsappsend.page.scss'],
})
export class ModalapoiowhatsappsendPage implements OnInit {

  @Input() dadosFinanceiro: any;
  private dadosEnvio = {
    para:'',
    anexo:'',
    mensagem:''
  }

  private dadosMensagem: Mensagens = {};
  constructor(
    private srvParceiro:ParceirosService,
    private ctrlModal:ModalController,
    private design:ProcessosService,
    private srvMensagem:MensagensService
  ) { }
  closeModal(){
    this.ctrlModal.dismiss()
  }
  enviar(){
        this.dadosMensagem.mensagem = this.dadosEnvio.mensagem;
        this.dadosMensagem.naoRespondeuUid = "";
        this.dadosMensagem.canal = "whatsapp";
        this.dadosMensagem.contatoOrigem = this.dadosEnvio.para;
        this.dadosMensagem.tipo = 'texto';
        this.srvMensagem.EnviarMensagemAvulsa(this.dadosMensagem.contatoUid,this.dadosMensagem)
        .then(res=>{

          if(this.dadosEnvio.anexo)
          {
            this.dadosMensagem.mensagem = this.dadosEnvio.anexo
            this.dadosMensagem.anexo =  this.dadosEnvio.anexo
            this.dadosMensagem.naoRespondeuUid = "";
            this.dadosMensagem.canal = "whatsapp";
            this.dadosMensagem.contatoOrigem = this.dadosEnvio.para;
            this.dadosMensagem.tipo = 'anexo';
            this.srvMensagem.EnviarMensagemAvulsa(this.dadosMensagem.contatoUid,this.dadosMensagem)
            .then(res2=>{
              this.design.presentToast(
                'Enviado com sucesso',
                'success',
                3000
              )
            })
            .catch(err2=>{
              console.log(err2)
              this.design.presentToast(
                'Falha ao enviar mensagem ',
                'danger',
                0,
                true
              )
            })
          }
          else
          {
            this.design.presentToast(
              'Enviado com sucesso',
              'success',
              3000
            )
          }
         
        })
        .catch(err=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao enviar mensagem  2',
            'danger',
            0,
            true
          )
        })
        
  }
  ngOnInit() {
    if(this.dadosFinanceiro)
    {

      console.log(this.dadosFinanceiro)
      //DADOS FINANCEIROS
      let parceiroUid = this.dadosFinanceiro.parceiroUid
      this.srvParceiro.parceirosGet(parceiroUid)
      .then(resParceiro=>{
        console.log(resParceiro)
        this.dadosMensagem.contatoUid = resParceiro.id
        
        this.dadosEnvio.para = resParceiro.contato.telefone
      })
      this.dadosEnvio.anexo = this.dadosFinanceiro.dadosBoleto.url
     
      this.dadosEnvio.mensagem = "Olá "+this.dadosFinanceiro.nome+", segue neste e-mail seu boleto para pagamento.\nLinha digitavél: "
      +this.dadosFinanceiro.dadosBoleto.linhaDigitavel

    }
  }

}
