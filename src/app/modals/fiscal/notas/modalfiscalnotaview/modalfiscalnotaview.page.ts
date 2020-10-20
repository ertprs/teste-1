import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiscalService } from 'src/app/service/fiscal/fiscal.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-modalfiscalnotaview',
  templateUrl: './modalfiscalnotaview.page.html',
  styleUrls: ['./modalfiscalnotaview.page.scss'],
})
export class ModalfiscalnotaviewPage implements OnInit {

  @Input() dadosNota:any
  @Input() dadosPedido:any
  @Input() notaUid:string


  private btnEmitirNota:boolean = false;


  private informacoesoNota = {
    tipo:"NFe",
    pedidoUid:"",
    dadosNota:{
      travarNota:false,
      ambienteEmissao:'homologacao',
      naturezaOperacao:"",
      finalidade:"",
      tipoOperacao:"",
      consumidorFinal:"",
      enviarPorEmail:"",
      situacaoCod:0,
      situacaoNome:"",
      nfNumero:0,
      dataEmissao:0,
      chaveDeAcesso:"",
      chaveDeAcessoReferencia:"",
      linkPDF:"",
      linkXML:"",
      nfNumeroProtocolo:"",
      nfeStatus:"",
      nfeMotivoStatus:"",
      parceiroUid:"",
      parceiroNome:"",
      parceiroEmail:"",
      transportadoraUid:"",
      transportadoraNome:"",
      dtEmissaoMes:0,
      dtEmissaoAno:0,
      dtEmissaoDia:0
    },
    transporte:{
      frete:{
        modalidade:"",
        valor:null
      },
      volume:{
        quantidade:0,
        especie:"",
        marca:"",
        numeracao:"",
        pesoLiquido:0,
        pesoBruto:0

      }
    },
    informacoesAdicionais:""
  }

  constructor(
    private ctrlModal:ModalController,
    private srvFiscal:FiscalService,
    private design:ProcessosService
  ) { }

  ngOnInit() {
    if(this.dadosPedido)
    {
      //NOTA AINDA NAO ENTROU EM PROCESSAMENTO
      this.btnEmitirNota = true
      console.log(this.dadosPedido)
      this.informacoesoNota.pedidoUid                   = this.dadosPedido.id
      this.informacoesoNota.dadosNota.ambienteEmissao   = "Homologacao"
      this.informacoesoNota.dadosNota.finalidade        = "Normal"
      this.informacoesoNota.dadosNota.naturezaOperacao  = this.dadosPedido.cfopDescricao
      this.informacoesoNota.dadosNota.tipoOperacao      = this.dadosPedido.cfopTipoOperacao
      this.informacoesoNota.dadosNota.consumidorFinal   = "sim"
      this.informacoesoNota.dadosNota.enviarPorEmail    = "sim"
      this.informacoesoNota.dadosNota.parceiroUid       = this.dadosPedido.parceiroUid
      this.informacoesoNota.dadosNota.parceiroNome      = this.dadosPedido.parceiroNome
      this.informacoesoNota.dadosNota.parceiroEmail     = ""
      this.informacoesoNota.dadosNota.transportadoraUid = this.dadosPedido.transportadoraUid
      this.informacoesoNota.dadosNota.transportadoraNome= this.dadosPedido.transportadoraNome

      this.informacoesoNota.transporte.frete.modalidade = this.dadosPedido.frete
     


    }
    else if (this.notaUid)
    {
      
        this.abrirDadosNota(this.notaUid)
    }
  }
  async abrirDadosNota(notaUid:string)
  {
    this.srvFiscal.notaGet(notaUid).subscribe(element=>{
      this.informacoesoNota = element
    })
  }
  close(){
    this.ctrlModal.dismiss()
  }
  ajusteRespostaNota(notaUid:string)
  {
    this.informacoesoNota.dadosNota.travarNota = true
    this.informacoesoNota.dadosNota.situacaoCod = 1,
    this.informacoesoNota.dadosNota.situacaoNome = "Iniciando envio"
    this.btnEmitirNota = false

    //INICIAR PREPARO para EMitir nota fiscal
    this.srvFiscal.EnviarNotaEnotas(notaUid).subscribe(dadosRetEnotas=>{
      console.log(dadosRetEnotas)
      this.abrirDadosNota(notaUid)
    })
  }
  Download(url)
  {
    window.open(url, '_blank');
 
  }
  gravar()
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma emitir a nota fiscal?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        if(!this.notaUid)
        {
          this.design.presentLoading('Preparando nota fiscal...')
          .then(resLoading=>{
            resLoading.present()

            this.srvFiscal.notaAdd(this.informacoesoNota)
            .then(resAdd=>{
              this.notaUid = resAdd.id

              //AJUSTAR DADOS DE EXIBICAO
              
              this.ajusteRespostaNota(resAdd.id)


              this.design.presentToast(
                'Nota enviada para processamento',
                'success',
                5000
              )
            })
            .catch(err=>{
              console.log(err)
              this.design.presentToast(
                'Falha iniciar processo de nota fiscal ',
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
          this.design.presentLoading('Atualizando nota fiscal...')
          .then(resLoading=>{
            resLoading.present()

            this.srvFiscal.notaAtualizar(this.notaUid,this.informacoesoNota)
            .then(resAdd=>{
              this.notaUid = resAdd.id

              //AJUSTAR DADOS DE EXIBICAO
              
              this.ajusteRespostaNota(resAdd.id)


              this.design.presentToast(
                'Nota enviada para processamento',
                'success',
                5000
              )
            })
            .catch(err=>{
              console.log(err)
              this.design.presentToast(
                'Falha iniciar processo de nota fiscal ',
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

}
