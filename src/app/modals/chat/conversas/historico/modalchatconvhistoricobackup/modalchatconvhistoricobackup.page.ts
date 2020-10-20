import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-modalchatconvhistoricobackup',
  templateUrl: './modalchatconvhistoricobackup.page.html',
  styleUrls: ['./modalchatconvhistoricobackup.page.scss'],
})
export class ModalchatconvhistoricobackupPage implements OnInit {

  @Input() dadosConversa: any;

  private itensHistoricos = []

  constructor(
    private srvContatos:ContatosService,
    private design:ProcessosService,
    private ctrlModal:ModalController
  ) { }
  closeModal(){
    this.ctrlModal.dismiss()
  }
  ngOnInit() {
   
    this.design.presentLoading('Verificando backup...')
    .then(resLoading=>{
      resLoading.present()

      this.srvContatos.conversasBackup(this.dadosConversa.contatoOrigem).then(res=>{
        if(res.situacao == 'suc')
        {
          const dados = res.data.data[0]
          if(dados.length > 0)
          {
            console.log(dados)

            dados.forEach(dadosEmit => {
              dadosEmit.mensagem = dadosEmit.mensagem.split('||').join('\n')
              dadosEmit.es = 's'
              if(dadosEmit.pidUser != '99999')
              {
                dadosEmit.es = 'e'
              }
              let unix_timestamp = 1549312452
              // Create a new JavaScript Date object based on the timestamp
              // multiplied by 1000 so that the argument is in milliseconds, not seconds.
              dadosEmit.dataStamp = new Date(dadosEmit.dataStamp * 1000);

              this.itensHistoricos.push(dadosEmit)
            });

           
          }
          else
          {
            this.design.presentToast('Não existem dados a serem exibidos','warning',4000)
            this.closeModal()
          }
        }
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          err,
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
