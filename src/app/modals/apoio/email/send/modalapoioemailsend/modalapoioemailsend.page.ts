import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { EmailService } from 'src/app/services/email/email.service';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';

@Component({
  selector: 'app-modalapoioemailsend',
  templateUrl: './modalapoioemailsend.page.html',
  styleUrls: ['./modalapoioemailsend.page.scss'],
})
export class ModalapoioemailsendPage implements OnInit {


  @Input() dadosFinanceiro: any;



  private dadosEmail = {
    assunto:'',
    para:'',
    anexo:'',
    mensagem:''
  }
  constructor(
    private ctrlModal:ModalController,
    private design:ProcessosService,
    private srvEmail:EmailService,
    private srvParceiro:ParceirosService
  ) { }
  closeModal(){
    this.ctrlModal.dismiss()
  }
  ngOnInit() {
    if(this.dadosFinanceiro)
    {

      console.log(this.dadosFinanceiro)
      //DADOS FINANCEIROS
      let parceiroUid = this.dadosFinanceiro.parceiroUid
      this.srvParceiro.parceirosGet(parceiroUid)
      .then(resParceiro=>{
       
        this.dadosEmail.para = resParceiro.contato.email
      })
      this.dadosEmail.anexo = this.dadosFinanceiro.dadosBoleto.url,
      this.dadosEmail.assunto = 'Notificação de cobrança'
      this.dadosEmail.mensagem = "Olá "+this.dadosFinanceiro.nome+", segue neste e-mail seu boleto para pagamento.<br>Linha digitavél: "
      +this.dadosFinanceiro.dadosBoleto.linhaDigitavel

    }
  }

  enviarEmail(){
    this.design.presentLoading('Enviando para caixa de saida...')
    .then(resLoading=>{
      resLoading.present()
      this.srvEmail.enviarEmail(this.dadosEmail)
      .then(resEnvio=>{
        this.design.presentToast(
          'Mensagem aguardando na caixa de saida',
          'secondary',
          4000
        )
        this.closeModal()
      })
      .catch(errEnvio=>{
        console.log(errEnvio)
        this.design.presentToast(
          'Falha ao tentar enviar e-mail. Tente novamente mais tarde',
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
