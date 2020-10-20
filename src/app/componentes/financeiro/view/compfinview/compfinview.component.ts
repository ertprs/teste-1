import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalfincategoriaconsultaPage } from 'src/app/modals/financeiro/categorias/consulta/modalfincategoriaconsulta/modalfincategoriaconsulta.page';
import { ConsultaPage } from 'src/app/modals/parceiros/consulta/consulta.page';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { LancamentoService } from 'src/app/services/financeiro/lancamento.service';

@Component({
  selector: 'app-compfinview',
  templateUrl: './compfinview.component.html',
  styleUrls: ['./compfinview.component.scss'],
})
export class CompfinviewComponent implements OnInit {

  @Input() data: any;
 
  private dadosLancamento ={
    
    bairro: "",
    bancoNome: "",
    bancoUid: "",
    c_d: "",
    cep: "",
    cidade: "",
    cidadeCodIbge: "",
    classificacaoDreFiltro: "",
    classificacaoEsfera: "",
    classificacaoNome: "",
    classificacaoUid: "",
    complemento: "",
    documento: "",
    dtNascimento: "",
    endereco: "",
    enderecoN: "",
    estado: "",
    isBoleto: false,
    isCancelado:false,
    isCartao: false,
    isIntegracoes: false,
    isVencido:false,
    isPago: false,
    libBoleto: true,
    libCartao: false,
    libCripto:false,
  
    notaFiscal:'',
    observacoes:"",
    moeda: {
      finaNome: "",
      finalCod: 0,
      origemCod: 1,
      origemNome: "Real",
      valorConversao: 0
    },
    nome: "",
    pais: "",
    parceiroUid: "",
    situacaoCod: 0,
    situacaoNome: "Digitando",
    tipoLancamentoCod: "",
    tipoLancamentoNome: "",
    tipoRegistroCod: 1,
    tipoRegistroNome: "Individual",
    valor_desconto: 0,
    valor_juros: 0,
    valor_principal:"",
    vencimento:"",
    categoriaNome:'',
    categoriaUid:'',
    categoriaDRE:'',
    categoriaDRENome:''
  }
  private lancamentoUid:string;




  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvLancamentos:LancamentoService,
    private ctrlModal:ModalController,
    private design:ProcessosService
  ) { }

  ngOnInit() {

    console.log(this.data)
    if(this.data.id)
    {
      this.lancamentoUid = this.data.id
   
      this.carregarDadosLancamento(this.lancamentoUid )
    }
    

  }

  carregarDadosLancamento(uid:string)
  {
    this.srvLancamentos.getLancamento(uid).subscribe(dados=>{
      if(dados.exists)
      {
        const id = dados.id
        const data = dados.data()
        const dadosAdd = {
          id,
          ... data
        }
        this.dadosLancamento = <any>dadosAdd
      }
    })
 
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
  
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  gravarNovo2(){
    console.log(this.dadosLancamento.vencimento)

    const vencimentoRecuperado = this.dadosLancamento.vencimento.split('-')
  
    const timestamp = new Date(Number(vencimentoRecuperado[0]), Number(vencimentoRecuperado[1])-1, Number(vencimentoRecuperado[2])).getTime();
    //const vencimentoNovo = new Date(Date.UTC(Number(vencimentoRecuperado[2]),Number(vencimentoRecuperado[1]),Number(vencimentoRecuperado[0]),1,0,3)).getTime()
    //const vencimentoNovo = new Date(Number(vencimentoRecuperado[2]),Number(vencimentoRecuperado[1])+1,Number(vencimentoRecuperado[0]),0,0,0,0).getTime()
    console.log(timestamp)
  }
  gravarNovo()
  {

    
    this.design.presentAlertConfirm(
      'Confirmação',
      'Você confirma criar lançamento',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Inserindo...')
        .then(resLoading=>{
          resLoading.present()
          this.srvLancamentos.lancamentoNew(this.dadosLancamento)
          .then(resAdd=>{


            //ADICIONAR NO SQL
            this.dadosLancamento["id"] = resAdd.id
            this.srvLancamentos.lancamentoNewSQL(this.dadosLancamento).subscribe(dadosEnvioSql=>{
              resLoading.dismiss()
              this.lancamentoUid = resAdd.id
              this.carregarDadosLancamento(resAdd.id )
              console.log(dadosEnvioSql)
              this.design.presentToast(
                'Lançamento gerado com sucesso',
                'success',
                4000
              )
            })

           
          })
          .catch(errAdd=>{
            resLoading.dismiss()
            console.log(errAdd)
            this.design.presentToast(
              'Falha ao inserir lançamento',
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
  limparCampo(event:any,apenas:any)
  {
    
    if(apenas === 'number')
    {
      //event.target.value = event.target.value.replace(/[^0-9]*/g, '');
      //event.target.value =  event.target.value.replace(/[-][\d]*[.]{0,2}[\d]+/g, '');
      event.target.value = event.target.value.replace(/[^0-9]*[,]/g, '');
    }
  }
  async atualizarLancamento()
  {
    this.design.presentAlertConfirm(
      "Confirmação",
      "Confirma atualizar os dados deste lançamento?",
      "Claro",
      "Não"
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading("Atualizando...")
        .then(resLoading=>{
          resLoading.present()
          this.srvLancamentos.lancamentoUpdate(this.lancamentoUid,this.dadosLancamento)
          .then(res=>{
            this.design.presentToast(
              'Atualizado com sucesso',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao atualizar os dados',
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
  async abrirConsultaCategoria(){
    const modal = await this.ctrlModal.create({
      component: ModalfincategoriaconsultaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        origem:'financeiro'
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        const data = dados.data
        this.dadosLancamento.categoriaDRE = data.dre
        this.dadosLancamento.categoriaUid = data.uid
        this.dadosLancamento.categoriaNome = data.nome
        this.dadosLancamento.categoriaDRENome = data.dreNome
        //const dadosRecebidos = dados.data.dados
        //this.dadosLancamento.nome = dadosRecebidos.razaoSocial,
        //this.dadosLancamento.parceiroUid = dadosRecebidos.uid

      }
    })

    await modal.present();
  } 
  async AbrirConsultaParceiros()
  {
  

    const modal = await this.ctrlModal.create({
      component: ConsultaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        origem:'financeiro'
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        const dadosRecebidos = dados.data.dados
        this.dadosLancamento.nome = dadosRecebidos.razaoSocial,
        this.dadosLancamento.parceiroUid = dadosRecebidos.uid

      }
    })

    await modal.present();
  }
}
