import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConsultaPage } from 'src/app/modals/parceiros/consulta/consulta.page';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { LancamentoService } from 'src/app/services/financeiro/lancamento.service';

@Component({
  selector: 'app-modalfinrecadd',
  templateUrl: './modalfinrecadd.page.html',
  styleUrls: ['./modalfinrecadd.page.scss'],
})
export class ModalfinrecaddPage implements OnInit {

  @Input() uid:string
  private recorrenciaUid:string


  private dadosRecorrencia = {
    parceiroUid:'',
    parceiroNome:'',
    valor:0,
    periodo:'',
    diaNota:'',
    diaVencimento:'',
    situacao:true, // ATIVO ou DESATIVADO
    ultimoFechamento:0,
    proximoFechamento:0,
  
    qtdProcessos:0,
    vrAdicional:0
  }
  constructor(
    private ctrlModal:ModalController,
    private design:ProcessosService,
    private srvFinanceiro:LancamentoService
  ) { }

  ngOnInit() {
    if(this.uid)
    {
      this.recorrenciaUid = this.uid
      this.abrirDadosRecorrencia()
    }
  }
  abrirDadosRecorrencia()
  {

     this.srvFinanceiro.recorrenciaGet(this.recorrenciaUid).forEach(dados=>{
       if(dados.exists)
       {
         const data = dados.data()
          console.log(data)
          data.proximoFechamento = (data.proximoFechamento * 1000)
          data.ultimoFechamento = (data.ultimoFechamento * 1000)
         this.dadosRecorrencia = <any>data
       }
      
    })
  
  }
  modalClose(){
    this.ctrlModal.dismiss()
  }
  limparCampo(event:any,apenas:any)
  {
    
    if(apenas === 'number')
    {
      //event.target.value = event.target.value.replace(/[^0-9]*/g, '');
      //event.target.value =  event.target.value.replace(/[-][\d]*[.]{0,2}[\d]+/g, '');
      event.target.value = event.target.value.replace(/[^0-9]*[,]/g, '');
    }
  }
  async gravar()
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma gravar esta recorrência?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      { 

        if(!this.recorrenciaUid)
        { 
          
          //NOVO
          this.design.presentLoading('Aguarde ...')
          .then(resLoading=>{
            resLoading.present()
            this.srvFinanceiro.recorrenciaAdd(this.dadosRecorrencia)
            .then(resAdd=>{
              this.recorrenciaUid = resAdd.id
              this.design.presentToast(
                'Recorrência criada com sucesso',
                'success',
                3000
              )
            })
            .catch(err=>{
              console.log(err)
              this.design.presentToast(
                'Falha ao inserir recorrencia',
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
        else
        {
          //ATUALIZAR
          this.design.presentLoading('Atualizando ... ')
          .then(resLoading=>{
            resLoading.present()
            this.srvFinanceiro.recorrenciaAtualizar(this.recorrenciaUid,this.dadosRecorrencia)
            .then(resUpdate=>{
              this.design.presentToast(
                'Atualizado com sucesso',
                'success',
                3000
              )
            })
            .catch(errUpdate=>{
              console.log(errUpdate)
              this.design.presentToast(
                'Falha ao processar atualização de recorrência',
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
    })
  }
  async AbrirConsultaParceiros()
  {
  

    const modal = await this.ctrlModal.create({
      component: ConsultaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        origem:'fin-recnew'
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        const dadosRecebidos = dados.data.dados
        this.dadosRecorrencia.parceiroNome = dadosRecebidos.razaoSocial
        this.dadosRecorrencia.parceiroUid = dadosRecebidos.id
        
      }
    })

    await modal.present();
  }

}
