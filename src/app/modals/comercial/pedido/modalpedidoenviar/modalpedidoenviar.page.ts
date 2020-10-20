import { AngularFireAuth } from '@angular/fire/auth';
import { Pedidositens } from './../../../../interface/comercial/pedidositens';
import { AuthService } from './../../../../services/seguranca/auth.service';
import { ComercialService } from './../../../../services/comercial/comercial.service';
import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { ModalController, Platform } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Pedidos } from 'src/app/interface/comercial/pedidos';

import { Mensagens } from 'src/app/interface/chat/mensagens';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';



//PDF
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Router } from '@angular/router';
import { UploadstorageService } from 'src/app/services/global/uploadstorage.service';
import { Conversas } from 'src/app/interface/chat/conversas';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-modalpedidoenviar',
  templateUrl: './modalpedidoenviar.page.html',
  styleUrls: ['./modalpedidoenviar.page.scss'],
})
export class ModalpedidoenviarPage implements OnInit {

  @Input() dadosPedSend:Pedidos;
  @Input() dadosConversa:Conversas;
  @Input() pedidoItemsList:Pedidositens





  
  public dadosMensagem:Mensagens = {};
  public vrTotal:string = '';
  public fraseEnvio:string = '';
  public conversaUid:string = '';

  public envioTipo:string = 'msg';
   //PDF
   letterObj = {
    to: '',
    from: '',
    text: '',
    assinatura:''
  }
 
  pdfObj = null;

  constructor(
    private ctrlModal:ModalController,
    private design:ProcessosService,
    private ctrlMensagens:MensagensService,
    private eventEmitterService: ProvEmitterEventService,
    private serviceComercial:ComercialService,
    private authService:AuthService,
    private afa:AngularFireAuth,

    public router:Router,
    public uploadService:UploadstorageService,
  ) 
  { 
    
   
  }

  ngOnInit() {
    
    if(this.dadosPedSend)
    {
      let formato = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
      this.vrTotal = this.dadosPedSend.total.toLocaleString('pt-BR', formato); /* $2,500.00 */
      this.fraseEnvio = 'Conforme sua solicitação segue o valor de nossa proposta '+this.vrTotal+'. O prazo de validade desta é de 5 dias corridos. '
      
      if(this.dadosConversa)
      {
        this.conversaUid = this.dadosConversa["conversaUid"];
        this.dadosConversa = this.dadosConversa["dadosConversa"]
      
      }
      
    }
  }
  functionExecute(functionName:string,params:any)
  {



    console.log('preparando '+ functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  closeModel(){
    this.ctrlModal.dismiss();
  }
  backConversa()
  {
    this.design.presentAlertConfirm(
      'Voltar para conversa?',
      'Você quer voltar para a conversa agora ?',
      'Quero',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.closeModel();
        this.functionExecute('chatConversaOpen',{conversaUid:this.conversaUid,contatoUid:this.dadosConversa.contatoUid,situacao:2})
      }
      
    })
  }
  SendMensagem()
  {
    if(this.dadosConversa)
    {
      this.design.presentLoading('Enviando ...')
      .then(resLoadingg=>{
        resLoadingg.present();

        //DADOS DA MENSAGEM
     

        this.dadosMensagem.mensagem = this.fraseEnvio;

        this.dadosMensagem.canal = this.dadosConversa.canal;
        this.dadosMensagem.contatoOrigem = this.dadosConversa.contatoOrigem;
        this.dadosMensagem.contatoUid = this.dadosConversa.contatoUid;
        this.dadosMensagem.tipo = 'texto';
     
        this.ctrlMensagens.SendMesg( this.conversaUid ,this.dadosMensagem)
        .then(res=>{
          this.design.presentToast(
            'Mensagem enviada com sucesso',
            'success',
            3000
          )
          this.backConversa();
          
        })
        .catch(err=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao enviar mensagem',
            'danger',
            0,
            true
          )
        })
        .finally(()=>{
          resLoadingg.dismiss();
        })
      })
     
    }
    else
    {
      this.design.presentToast(
        'Não existem dados de conversa ativa',
        'secondary',
        0,
        true
      )
    }
  }

  createPdf() {

    this.design.presentLoading('Gerando PDF...')
    .then(resLoading=>{
      resLoading.present();
     
      const dadosDocPdf = this.serviceComercial.getDadosOrcamento(this.dadosPedSend,this.pedidoItemsList)
      const currentUser = this.authService.getCUrrentUser();
      const empEmitente  = this.authService['empresa'];
      this.letterObj = {
        to: this.dadosPedSend.contatoNome+' - '+this.dadosPedSend.clienteNome,
        from: empEmitente,
        text: 'Conforme conversamos segue orçamento para sua análise.',
        assinatura: this.afa.auth.currentUser.displayName
      }



      var docDefinition = {
        content: [
          { text: 'ORÇAMENTO', style: 'header' },
          { text: dadosDocPdf.cabecalho.data, alignment: 'right' },
   
          { text: 'De', style: 'subheader' },
          { text: dadosDocPdf.cabecalho.de+' - '+dadosDocPdf.assinatura.nomeUsuario },
   
          { text: 'Para', style: 'subheader' },
          { text: dadosDocPdf.cabecalho.para.contato + ' - '+dadosDocPdf.cabecalho.para.empresa },

          { text: 'Condição de pagamento', style: 'subheader' },
          { text: dadosDocPdf.condPagamento  },

          

         
          { text: dadosDocPdf.texto, style: 'story', margin: [0, 20, 0, 20] },

          //COLUNAS DE ITENS
          dadosDocPdf.itensHeader,
          dadosDocPdf.itens,
          
          

         
         
         
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 0]
          },
          story: {
            italic: true,
            alignment: 'justify',
            width: '90%',
          }
        }
      }
      this.pdfObj = pdfMake.createPdf(docDefinition);
      resLoading.dismiss();
      //ENVIAR ARQUIVO
      this.EnviarPdfStorage();
  
    })
    
  
  }
  async EnviarMesagem(urlDownlod:string)
  {
    console.log('URL '+urlDownlod)
    this.design.presentLoading('Enviando mensagem...')
    .then(async resLoading=>{
      resLoading.present();

      this.dadosMensagem.mensagem = '';
      this.dadosMensagem.canal = this.dadosConversa.canal;
      this.dadosMensagem.contatoOrigem = this.dadosConversa.contatoOrigem;
      this.dadosMensagem.contatoUid = this.dadosConversa.contatoUid
      this.dadosMensagem.tipo = 'anexo';
      this.dadosMensagem.anexo = urlDownlod;

      await this.ctrlMensagens.SendMesg(this.conversaUid,this.dadosMensagem)
      .then(resMensagem=>{
        this.design.presentToast(
          'PDF enviada com sucesso',
          'success',
          3000
        )
        this.backConversa();
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Falha o enviar PDF',
          'danger',
          0,
          true
        )
      })
      .finally(()=>{
        resLoading.dismiss()
      })
     

    })
    .catch((err)=>{
      console.log('Falha ao iniciar loading')
      console.log(err)
      this.design.presentToast(
        'Falha ao processar loading',
        'danger',
        4000
      )
    })
    

   
  }
  async EnviarPdfStorage()
  {
    
    

        this.design.presentLoading('Gravando PDF...')
        .then(async resLoading=>{
          resLoading.present();
          const randomId = Math.random().toString(36).substring(2);
          const nomeArquivo = new Date().getTime()+randomId+'.pdf';
          const dadosPDF ={
            randonName:nomeArquivo,
            mime:'application/pdf',
    
          }
          await this.pdfObj.getBase64(async data => {
            
            await this.uploadService.enviarArquivo(dadosPDF,data,'comercial/orcamentos')
            .then(resUpload=>{
              resLoading.dismiss();
              console.log('Retorno do processo');
              console.log(resUpload)
              
    
              if(this.conversaUid)
              {
                console.log('Detectado conversa ativa, solicitar envio envio de mensagem com anexo ');
                this.design.presentAlertConfirm(
                  'Enviar orçamento?',
                  'Quer que eu já envie este orçamento para '+this.dadosConversa.contatoNome+'?',
                  'Manda',
                  'Não precisa!'
                ).then(resp=>{
                  
                  if(resp)
                  {
                    this.EnviarMesagem(resUpload);
                    
                  }
                })
              }
            })
            .catch(err=>{
              console.log('Falha ao enviar PDF para STORAGE')
              console.log(err);
            })
          })
        })

        
        
      
    
    
  }

}
