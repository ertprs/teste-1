import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


import { FiscalService } from 'src/app/service/fiscal/fiscal.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { UserService } from 'src/app/services/global/user.service';

@Component({
  selector: 'app-modalfiscalncmadd',
  templateUrl: './modalfiscalncmadd.page.html',
  styleUrls: ['./modalfiscalncmadd.page.scss'],
})
export class ModalfiscalncmaddPage implements OnInit {

  @Input() ncmUid:string
  private UFs = []
  private CSTICMS = [{codigo:"00",nome:"Tributada integralmente"},{codigo:"10",nome:"Tributada e com cobrança do ICMS por ST"},{codigo:"20",nome:"Com redução de base de cálculo"},{codigo:"30",nome:"Isenta/Não tributada e com cobrança do ICMS por ST"},{codigo:"40",nome:"Isenta"},{codigo:"41",nome:"Não Tributada"},{codigo:"50",nome:"Com Suspensão"},{codigo:"51",nome:"Com Diferimento"},{codigo:"60",nome:"ICMS Cobrado na Operação Anterior por Substituição Tributária"},{codigo:"70",nome:"Com redução de base de cálculo no ICMS ST"},{codigo:"90",nome:"Outras Operaçòes"},

  {
    codigo:"101",
    nome:"Tributada pelo Simples Nacional com permissão de crédito"
  },
  {
    codigo:"102",
    nome:"Tributada pelo Simples Nacional sem permissão de crédito"
  },
  {
    codigo:"103",
    nome:"Isenção do ICMS no Simples Nacional para faixa de receita bruta"
  },
  {
    codigo:"201",
    nome:"Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por substituição tributária"
  },
 
  {
    codigo:"202",
    nome:"Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por substituição tributária"
  },
  {
    codigo:"203",
    nome:"Isenção do ICMS no Simples Nacional para faixa de receita bruta e com cobrança do ICMS por substituição tributária"
  },
  {
    codigo:"300",
    nome:"Imune"
  },
  {
    codigo:"400",
    nome:"Não tributada pelo Simples Nacional"
  },
  {
    codigo:"500",
    nome:"ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação"
  },
  {
    codigo:"900",
    nome:"Outras Operaçòes"
  }
]
  private listaLucroReal = [
    {
      codigo:"00",
      nome:"Entrada com recuperação de crédito"
    },
    {
      codigo:"01",
      nome:"Entrada tributada com alíquota zero"
    },
    {
      codigo:"02",
      nome:"Entrada isenta"
    },
    {
      codigo:"03",
      nome:"Entrada não tributada"
    },
    {
      codigo:"04",
      nome:"Entrada imune"
    },
    {
      codigo:"05",
      nome:"Entrada com suspensão"
    },
    {
      codigo:"49",
      nome:"Outras Entradas"
    },
    {
      codigo:"50",
      nome:"Saída tributada"
    },
    {
      codigo:"51",
      nome:"Saída tributável com alíquota zero"
    },
    {
      codigo:"52",
      nome:"Saída isenta"
    },
    {
      codigo:"53",
      nome:"Saída não tributada"
    },
    {
      codigo:"54",
      nome:"Saída imune"
    },
    {
      codigo:"55",
      nome:"Saída com suspensão"
    },
    {
      codigo:"99",
      nome:"Outras saídas"
    }
  ]
  private dadosNcm = {
    ncm:'',
    nome:'',
    cest:'',
    ipi:{
      aliquota:0,
      situacaoTributariaSelect:"",
      situacaoTributaria:"",
      situacaoTributariaNome:"",
    }
  
   
    
  }
  private dadosReferencia = {
    uf:"",
    icmsInt:"",
    icmsTransf:"",
    MVA:"",
    situacaoTributaria:'',
    situacaoTributariaNome:'',
    situacaoTributariaSelect:''
  }
  private referenciaListar = []
  constructor(
    private ctrlModal:ModalController,
    private design:ProcessosService,
    private srvFiscal:FiscalService,
    private global:UserService
  ) { }
  closeModel()
  {
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
  abrirDadosNCM(ncmUid:string){
    this.design.presentLoading('Carregando dados...')
    .then(resLoading=>{
      resLoading.present()

      this.srvFiscal.ncmGet(ncmUid).subscribe(elemNCM=>{
        //FECHAR CARREGAMENTO
        resLoading.dismiss()

        if(elemNCM.exists)
        {

          const data = <any>elemNCM.data()
          this.dadosNcm = data

          this.listarReferencia()
        }
      })
      
    })
  }
  ngOnInit() {
    this.UFs = this.global.UFs

    if(this.ncmUid)
    {
      this.abrirDadosNCM(this.ncmUid)
      
    }
  }
  listarReferencia()
  {
    this.srvFiscal.ncmReferenciaGetAll(this.dadosNcm.ncm).subscribe(elemReferencia=>{
      this.referenciaListar = []
      if(!elemReferencia.empty)
      {
        console.log('Listar referencias ')
        elemReferencia.docs.forEach(dadosReferencia=>{
          const data = dadosReferencia.data()
          const id = dadosReferencia.id
          const referenciaAdicionar = {
            id,
            ... data
          }
          console.log(referenciaAdicionar)
          this.referenciaListar.push(referenciaAdicionar)
        })
      }
    })
  }
  deletarReferencia(referenciaUid:string)
  {
    this.design.presentAlertConfirm(
      'Excluir',
      'Confirma excluir esta referência?',
      'Sim',
      'Não' 
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Excluindo...')
        .then(resLoading=>{
          resLoading.present()

          this.srvFiscal.ncmReferenciaDelete(this.dadosNcm.ncm,referenciaUid)
          .then(res=>{
            this.listarReferencia()
            this.design.presentToast(
              'Excluido com sucesso',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao tentar excluir referencia',
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
  adicionarReferencia()
  {
    this.design.presentLoading('Adicionando...')
    .then(resLoading=>{
      resLoading.present()
      this.srvFiscal.ncmReferenciaAdd(this.dadosNcm.ncm, this.dadosReferencia)
      .then(resAdd=>{
        this.listarReferencia()
        this.design.presentToast(
          'Inserido com sucesso',
          'success',
          3000
        )
      })
      .catch(errAdd=>{
        console.log(errAdd)
        this.design.presentToast(
          'Falha ao adicionar referência',
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
  gravar()
  {
    this.design.presentAlertConfirm(
      'Confirma',
      'Confirma adicionar classificação fiscal',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Inserindo...')
        .then(resLoading=>{
          resLoading.present()
          this.srvFiscal.ncmAdd(this.dadosNcm)
          .then(resAdd=>{
            this.ncmUid = resAdd.id
            this.design.presentToast(
              'NCM adicionado com sucesso.',
              'success',
              3000
            )
          })
          .catch(errAdd=>{
            console.log(errAdd)
            this.design.presentToast(
              'Falha ao adicionar NCM',
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
