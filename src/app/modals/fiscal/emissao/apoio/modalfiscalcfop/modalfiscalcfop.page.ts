import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiscalService } from 'src/app/service/fiscal/fiscal.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-modalfiscalcfop',
  templateUrl: './modalfiscalcfop.page.html',
  styleUrls: ['./modalfiscalcfop.page.scss'],
})
export class ModalfiscalcfopPage implements OnInit {

  private CSTPISCOFINS= [
    {
      codigo:"01",
      nome:"Operação Tributável com Alíquota Básica"
    },
    {
      codigo:"02",
      nome:"Operação Tributável com Alíquota Diferenciada"
    },
    {
      codigo:"03",
      nome:"Operação Tributável com Alíquota por Unidade de Medida de Produto"
    },
    {
      codigo:"04",
      nome:"Operação Tributável Monofásica - Revenda a Alíquota Zero"
    },
    {
      codigo:"05",
      nome:"Operação Tributável por Substituição Tributária"
    },
    {
      codigo:"06",
      nome:"Operação Tributável a Alíquota Zero"
    },
    {
      codigo:"07",
      nome:"Operação Isenta da Contribuição"
    },
    {
      codigo:"08",
      nome:"Operação sem Incidência da Contribuição"
    },
    {
      codigo:"09",
      nome:"Operação com Suspensão da Contribuição"
    },
    {
      codigo:"49",
      nome:"Outras Operações de Saída"
    },
    {
      codigo:"50",
      nome:"Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno"
    },
    {
      codigo:"51",
      nome:"Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno"
    },
    {
      codigo:"52",
      nome:"Operação com Direito a Crédito - Vinculada Exclusivamente a Receita de Exportação"
    },
    {
      codigo:"53",
      nome:"Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno"
    },
    {
      codigo:"54",
      nome:"Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno"
    },
    {
      codigo:"55",
      nome:"Operação com Direito a Crédito - Vinculada a Receitas Não Tributadas no Mercado Interno e de Exportação"
    },
    {
      codigo:"56",
      nome:"Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno e de Exportação"
    },
    {
      codigo:"60",
      nome:"Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno"
    },
    {
      codigo:"61",
      nome:"Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno"
    },
    {
      codigo:"62",
      nome:"Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação"
    },
    {
      codigo:"63",
      nome:"Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno"
    },
    {
      codigo:"64",
      nome:"Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação"
    },
    {
      codigo:"65",
      nome:"Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação"
    },
    {
      codigo:"66",
      nome:"Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno e de Exportação"
    },
    {
      codigo:"67",
      nome:"Crédito Presumido - Outras Operações"
    },
    {
      codigo:"70",
      nome:"Operação de Aquisição sem Direito a Crédito"
    },
    {
      codigo:"71",
      nome:"Operação de Aquisição com Isenção"
    },
    {
      codigo:"72",
      nome:"Operação de Aquisição com Suspensão"
    },
    {
      codigo:"73",
      nome:"Operação de Aquisição a Alíquota Zero"
    },
    {
      codigo:"74",
      nome:"Operação de Aquisição sem Incidência da Contribuição"
    },
    {
      codigo:"75",
      nome:"Operação de Aquisição por Substituição Tributária"
    },
    {
      codigo:"98",
      nome:"Outras Operações de Entrada"
    },
    {
      codigo:"99",
      nome:"Outras Operações"
    }
  ]
  private dadosCfop = {
    tipo:"",
    codigo:"",
    nome:"",
    calcularICMS:false,
    calcularIPI:false,
    calcularPIS:false,
    calcularCOFINS:false,
    cfop:"",
    tipoOperacao:"",
    impostos:{
      pis:{
        aliquota:0,
        situacaoTributaria:'',
        situacaoTributariaNome:'',
        situacaoTributariaSelect:''
      
      },
      cofins:{
        aliquota:0,
        situacaoTributaria:'',
        situacaoTributariaNome:'',
        situacaoTributariaSelect:''
      
      }
    }
    
  }
  private listaCfop = []
  constructor(
    private ctrlModal:ModalController,
    private design:ProcessosService,
    private srvFiscal:FiscalService

  ) { }

  ngOnInit() {
    this.listarTodos()
  }
  close(){
    this.ctrlModal.dismiss()
  }
  deletar(cfopUid:string)
  { 

    this.design.presentAlertConfirm(
      'Excluir',
      'Confirma exclusão?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Excluindo...')
        .then(resLoading=>{
          resLoading.present()

          this.srvFiscal.cfopDelete(cfopUid)
          .then(resDelete=>{
            this.design.presentToast(
              'Excluido com sucesso',
              'success',
              3000
            )
            this.listarTodos()
          })
          .catch(errDelete=>{
            console.log(errDelete)
            this.design.presentToast(
              'Falha ao tentar excluir CFOP',
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
  listarTodos()
  {

    this.listaCfop = []
    this.srvFiscal.cfopGetAll().forEach(element=>{
      if(!element.empty)
      {
        element.docs.forEach(itens=>{
          if(itens.exists)
          {
            const data = itens.data()
            const id = itens.id

            const itemAdd = {
              id,
              codigo:data.cfop,
              nome:data.nome,
              ... data
            }
            this.listaCfop.push(itemAdd)
          }
        })
      }
    })
  }
  gravar()
  {
    this.design.presentAlertConfirm(
      'Confirma',
      'COnfirma inserir esta CFOP?',
      'Claro',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        //AJUSTANDO CÓDIGOS
        const tipoSelecionado = this.dadosCfop.tipo.split('|')
        const tipoCodigo      = tipoSelecionado[0]
        const tipoNome        = this.dadosCfop.codigo
        this.dadosCfop.cfop   = tipoCodigo+""+tipoNome

        if(tipoCodigo == "1" || tipoCodigo == "2" || tipoCodigo == "3")
        {
          this.dadosCfop.tipoOperacao = "Entrada"
        }

        if(tipoCodigo == "5" || tipoCodigo == "6" || tipoCodigo == "7")
        {
          this.dadosCfop.tipoOperacao = "Saida"
        }




        console.log(this.dadosCfop)
        this.design.presentLoading('Gravando')
        .then(resLoading=>{
          resLoading.present()

          this.srvFiscal.cfopAdd(this.dadosCfop)
          .then(resAdd=>{
            this.listarTodos()
            this.design.presentToast(
              'Adicionado com sucesso',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao adicionar CFOP',
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
  selecionar(item:any)
  {
    this.ctrlModal.dismiss(item)
  }

}
