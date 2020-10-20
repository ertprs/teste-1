import { CondpagamentoService } from './../../../services/financeiro/configuacoes/condpagamento.service';
import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { UploadstorageService } from './../../../services/global/uploadstorage.service';
import { NavController, Platform, LoadingController } from '@ionic/angular';
import { ComercialService } from './../../../services/comercial/comercial.service';
import { Component, OnInit } from '@angular/core';
import { Pedidos } from 'src/app/interface/comercial/pedidos';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedidositens } from 'src/app/interface/comercial/pedidositens';
//PDF
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Mensagens } from 'src/app/interface/chat/mensagens';
import { Conversas } from 'src/app/interface/chat/conversas';
import { Itcondpagamento } from 'src/app/interface/financeiro/configuracoes/itcondpagamento';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  private pedidoUid: string = null;
  public contatoUid: string = null;
  public contatoNome: string = null;
  public clienteUid: string = null;
  public clienteNome: string = null;
  public conversaCanal: string = null;
  public contadoOrigem: string = null;

  public conversaUid:string = null;
  public pedido = new Array<Pedidos>();
  public pedidoSubscription: Subscription;

  public pedidoItems = new Array<Pedidos>();


  public pedidoItemsList = new Array<Pedidositens>();
  public pedidoItemsSubscription: Subscription;


  public condpagamentoItemsList = new Array<Itcondpagamento>();
  public condpagamentoSubscription: Subscription;

  public dadosPedido: Pedidos = {};
  private dadosMensagem: Mensagens = {};
  private dadosConversa: Conversas = {};

  //PDF
  letterObj = {
    to: '',
    from: '',
    text: '',
    assinatura:''
  }
 
  pdfObj = null;
  constructor(
    public serviceComercial:ComercialService,
    public design:ProcessosService,
    public navCtrl:NavController,
    public activatedRoute: ActivatedRoute,
    public router:Router,
    public uploadService:UploadstorageService,
    public plt: Platform,
    public ctrlLoading:LoadingController,
    public afAuth:AngularFireAuth,
    public authService:AuthService,
    public serviceConversa:ConversasService,
    public serviceMensagem:MensagensService,
    public serviceCondPagamento:CondpagamentoService
    
  ) {

    this.pedidoUid = this.activatedRoute.snapshot.params['pedidoUid']; 


    this.conversaUid = this.activatedRoute.snapshot.queryParamMap.get('conversaUid');
   

    if(this.conversaUid)
    {
      console.log('Foi identificado uma conversa vinculada '+this.conversaUid);
      this.contatoUid = decodeURI(this.activatedRoute.snapshot.queryParamMap.get('contatoUid'));
      this.contatoNome = decodeURI(this.activatedRoute.snapshot.queryParamMap.get('contatoNome'));
      this.clienteUid = decodeURI(this.activatedRoute.snapshot.queryParamMap.get('clienteUid'));
      this.clienteNome = decodeURI(this.activatedRoute.snapshot.queryParamMap.get('clienteNome'));
      this.conversaCanal = decodeURI(this.activatedRoute.snapshot.queryParamMap.get('canal'));
      this.contadoOrigem = decodeURI(this.activatedRoute.snapshot.queryParamMap.get('contadoOrigem'));
    }

    if (this.pedidoUid){
      //CARREGAR DADOS
      this.loadPedido(this.pedidoUid);
    }
    else
    {
      console.log('Criar novo pedido...');
      //CRIAR NOVO PEDIDO
      this.criarPedido();
    
    }


  }

  condPagamentoAdd(){
    alert('Cadastrar cond pagamento');
  }
  CondonChange(ev:any)
  {
    this.dadosPedido.condPagamentoUid = ev.target.value;
    console.log('Atualizando cond pagamento do pedido '+this.dadosPedido+' para '+this.dadosPedido.condPagamentoUid)
   
    this.serviceComercial.update(this.pedidoUid,this.dadosPedido)
    .then(()=>{
      console.log('Condição de pagamento vinculada com sucesso ');
    })
    .catch(err=>{
      console.log(err)
      this.design.presentToast(
        'Falha ao vincular cond. pagamento',
        'danger',
        4000
      )
    })
    
  }
   buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach(function(row) {
        var dataRow = [];

        columns.forEach(function(column) {
            dataRow.push(row[column]);
        })

        body.push(dataRow);
    });

    return body;
}

  table(data, columns) {
    return {
        table: {
            headerRows: 1,
            body: this.buildTableBody(data, columns)
        }
    };
}
  createPdf() {

    this.design.presentLoading('Gerando PDF...')
    .then(resLoading=>{
      resLoading.present();
     
      const dadosDocPdf = this.serviceComercial.getDadosOrcamento(this.dadosPedido,this.pedidoItemsList)
      console.log(dadosDocPdf);

      const currentUser = this.authService.getCUrrentUser();
      const empEmitente  = this.authService['empresa'];
     this.letterObj = {
        to: this.dadosPedido.contatoNome+' - '+this.dadosPedido.clienteNome,
        from: empEmitente,
        text: 'Conforme conversamos segue orçamento para sua análise.',
        assinatura: this.afAuth.auth.currentUser.displayName
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
    this.design.presentLoading('Enviando mensagem...')
    .then(async resLoading=>{
      resLoading.present();

      this.dadosMensagem.mensagem = '';
      this.dadosMensagem.canal = this.conversaCanal;
      this.dadosMensagem.contatoOrigem = this.contadoOrigem;
      this.dadosMensagem.contatoUid = this.contatoUid
      this.dadosMensagem.tipo = 'anexo';
      this.dadosMensagem.anexo = urlDownlod;

      console.log('Atualizando informações da conversa ');

      this.dadosConversa.comercialUrlOrcamento = urlDownlod;
      this.dadosConversa.intencao = 'comercial'
      this.dadosConversa.comercialUidOrcamento = this.pedidoUid;
      await this.serviceConversa.update(this.conversaUid,this.dadosConversa)
      .then(async res=>{
        
        console.log('Enviando mensagem agora ')
        console.log(this.dadosMensagem)

        await this.serviceMensagem.SendMesg(this.conversaUid,this.dadosMensagem)
        .then((resMensagem)=>{
          
          console.log('Mensagem enviada com sucesso')
          

        })
        .catch((errMensagem)=>{
          console.log('Falha ao enviar mensagem');
          console.log(errMensagem)
          this.design.presentToast(
            "Falha ao enviar mensagem ",
            "danger",
            4000
          )
        })
        .finally(()=>{
          resLoading.dismiss();
          console.log('Voltar para conversa '+this.conversaUid);
          let url = {
            queryParams:{
              idconversa:this.conversaUid
      
            }
          }
          this.router.navigate(['/chat/mensagens/'+this.dadosPedido.contatoUid], url);
        })
        
      })
      .catch((err)=>{
        console.log('ERROR ao atualizar dados comerciais em conversa');
        console.log(err);
        this.design.presentToast(
          "Falha ao atualizar dados comerciais ",
          "danger",
          4000
        )
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
    
    if (this.plt.is('cordova')) 
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
          
          await this.uploadService.enviarArquivo('',dadosPDF,data,'comercial/orcamentos')
          .then(resUpload=>{
            resLoading.dismiss();
            console.log('Retorno do processo');
            console.log(resUpload)
            
  
            if(this.conversaUid)
            {
              console.log('Detectado conversa ativa, solicitar envio envio de mensagem com anexo ');
              this.design.presentAlertConfirm(
                'Enviar orçamento?',
                'Quer que eu já envie este orçamento para '+this.contatoNome+'?',
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
    else{
      console.log('Plataforma não suportada para gerar PDF ');
      this.design.presentToast(
        'Método não suportado nesta aplicação',
        'danger',
        4000
      )
    }
    
  }

  ngOnInit() {
    

  }
  carregarItensPedido()
  {
    console.log('Preenchendo itens '+this.pedidoUid)
    this.pedidoItemsSubscription = this.serviceComercial.getAllItensPedido(this.pedidoUid).subscribe(data=>{
      console.log('Mudanca nos itens ');
      this.pedidoItemsList = data;
    });
  }
  async loadPedido(pedidoUid:string)
  {
    //CARREGAR CONDICOES DE PAGAMENTO 
    this.condpagamentoSubscription = this.serviceCondPagamento.getAll().subscribe(data => {
      console.log('Dados carregados '+JSON.stringify(data));
      this.condpagamentoItemsList = data;


      
      //carregar dados de pedido
      this.carregarItensPedido();
    })

    console.log('Carregando dados do pedido '+pedidoUid);
    this.pedidoSubscription = this.serviceComercial.get(pedidoUid).subscribe(data => {
      console.log('Dados carregados '+JSON.stringify(data));
      this.dadosPedido = data;


      
      //carregar dados de pedido
      this.carregarItensPedido();
    })
   
    
  }

  async criarPedido()
  {
    await this.design.presentLoading('Preparando...')
    .then((resLoading)=>{
      resLoading.present();
      
      if(this.conversaUid)
      {
        this.dadosPedido = this.dadosPedido;
        this.dadosPedido.contatoUid   = this.contatoUid;
        this.dadosPedido.contatoNome  = this.contatoNome;
        this.dadosPedido.clienteUid   = this.clienteUid;
        this.dadosPedido.clienteNome  = this.clienteNome;

        
        console.log('Preparando criação de orçamento com base em conversa');
        console.log(this.dadosPedido);
        console.log(this.dadosPedido.clienteNome);
        console.log('<!Preparando criação de orçamento com base em conversa!>');
      }
      console.log('Dados para criar o pedido ');
      console.log(this.dadosPedido);
      
      this.serviceComercial.add(this.dadosPedido)
        .then((res)=>{
          this.pedidoUid = res.id;
          console.log('Criado pedido '+this.pedidoUid);
          this.loadPedido(res.id);
          
        })
        .catch((err)=>{
          this.design.presentToast(
            'Falha ao criar pedido. Tente novamente mais tarde ',
            'danger',
            4000
          )
        })
        .finally(()=>{
          resLoading.dismiss();
        })
    })
    
  }
  checkPedido(){
    

    if(this.conversaUid)
    {
      //EXISTE CONVERSA
      console.log('Voltar para conversa '+this.conversaUid);
      let url = {
        queryParams:{
          idconversa:this.conversaUid
  
        }
      }
      this.router.navigate(['/chat/mensagens/'+this.dadosPedido.contatoUid], url);
    }
    else
    {
      if(this.dadosPedido.clienteNome == '')
      {
        //sair sem perguntar nada 
        this.serviceComercial.delete(this.pedidoUid)
        .then((res2)=>{
          
          this.router.navigate(['/comercial/home']);
        })
        .catch((res)=>{
          this.design.presentToast(
            'Problemas ao deletar rascunho',
            'danger',
            4000
          )
        })
       
      }
      else
      {
        if(this.dadosPedido.total > 0)
        {
          //DIRECIONAR DIRETO E NAO DEIXAR EXCLUIR
          this.router.navigate(['/comercial/home']);
        }
        else
        {
          //PERGUNTAR 
          //NAO EXISTE ITEM
          this.design.presentAlertConfirm(
            'Confirma',
            'Salvar este rascunho?',
            'Sim',
            'Nãoooo!'
          )
          .then((res)=>{
              if(res)
              {
                this.router.navigate(['/comercial/home']);
              }
              else
              {
                //NAO NAO SAIR
                //OK SAIR
                this.serviceComercial.deleteAllItens(this.pedidoUid)
                .then((retornoDeleteItens)=>{
                  if(retornoDeleteItens)
                  {
                    this.serviceComercial.delete(this.pedidoUid)
                    .then((res2)=>{
                      
                      this.router.navigate(['/comercial/home']);
                    })
                    .catch((res)=>{
                      this.design.presentToast(
                        'Problemas ao deletar rascunho',
                        'danger',
                        4000
                      )
                    })
                  }
                  else
                  {
                    this.design.presentToast(
                      'Falha ao deletar itens do pedido',
                      'danger',
                      4000
                    )
                  }
                })
                .catch((err)=>{
                  this.design.presentToast(
                    'Falha ao inexperada na exclusão dos itens',
                    'danger',
                    4000
                  )
                })
                
              }
          })
          .catch((err)=>{
            this.design.presentToast(
              'Houve um problema ao tentar sair. ',
              'danger',
              4000
            )
          })
  
         
          
        }
      }
    }

   
    
  }

}
