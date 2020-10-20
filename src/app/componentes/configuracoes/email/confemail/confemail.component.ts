import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { SrvconfemailService } from 'src/app/services/configuracoes/srvconfemail.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-confemail',
  templateUrl: './confemail.component.html',
  styleUrls: ['./confemail.component.scss'],
})
export class ConfemailComponent implements OnInit {


  public dadosEmail ={
    imapHost:'',
    imapUsuario:'',
    imapSenha:'',
    imapTLS:false,
    imapPorta:'',
    imapTest:false,
    smtpHost:'',
    smtpUsuario:'',
    smtpTest:false,
    smtpSenha:'',
    smtpSecure:false,
    smtpPorta:''
  }

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvConfEmail:SrvconfemailService,
    private design:ProcessosService
  ) { }

  ngOnInit() {

    this.srvConfEmail.getConfiguracao().subscribe(dados=>{
      if(dados.exists)
      {
        this.dadosEmail = <any>dados.data()
      }
    })


  }

  testConta(tipo:string)
  {
    this.design.presentAlertConfirm(
      'Teste '+tipo.toUpperCase(),
      'Confirma iniciar o teste de sua conta?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Aguarde, estou testando sua conta '+tipo.toUpperCase()+'  ...')
        .then(resLoading=>{
          resLoading.present()
          this.srvConfEmail.AddTest(tipo)
          .then(resAdd=>{
            let id = resAdd.id
            this.srvConfEmail.getTest(id).subscribe((dados:any)=>{
              //TESTADO COM SUCESSO
              if(dados.situacao == 1)
              {
                this.srvConfEmail.deleteTest(id)
                .catch(errDelete=>{
                  let msg1 = 'falha ao deletar teste'
                  console.log(msg1)
                })
                resLoading.dismiss()
                this.design.presentToast(
                  'Sua conta '+tipo.toUpperCase()+ ' respondeu com sucesso ao test',
                  'success',
                  0,
                  true
                )
              }

              //ERRO
              if(dados.situacao == 2)
              {
                this.srvConfEmail.deleteTest(id)
                .catch(errDelete=>{
                  let msg1 = 'falha ao deletar teste'
                  console.log(msg1)
                })
                resLoading.dismiss()
                this.design.presentToast(
                  'Sua conta  '+tipo.toUpperCase()+ '  não respondeu corretamente ao teste. Verifique as configurações de sua conta',
                  'danger',
                  0,
                  true
                )
                
              }


            })
          })
          .catch(errAdd=>{
            resLoading.dismiss()
            let msg = 'Falha ao adicionar o teste'
            console.log(msg)
            this.design.presentToast(
              'Falha ao adicionar teste',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
           
          })

        })
      }
    })
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  gravar()
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma gravar informações?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Gravando...')
        .then(resLoading=>{
          resLoading.present()

          this.srvConfEmail.SetConfiguracao(this.dadosEmail)
          .then(resAdd=>{
            this.design.presentToast(
              'Dados salvos com sucesso',
              'success',
              3000
            )
          })
          .catch(err=>{
            let msg = 'Falha ao gravar dados | '+err
            console.log(msg)
            this.design.presentToast(
              'Houve um problema ao tentar gravar dados',
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
    })
  }

}
