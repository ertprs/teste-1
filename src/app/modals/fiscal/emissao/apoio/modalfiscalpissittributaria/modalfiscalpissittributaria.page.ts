import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalfiscalpissittributaria',
  templateUrl: './modalfiscalpissittributaria.page.html',
  styleUrls: ['./modalfiscalpissittributaria.page.scss'],
})
export class ModalfiscalpissittributariaPage implements OnInit {

  private listaLucroReal= [
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
  constructor(
    private ctrlModal:ModalController
  ) { }

  ngOnInit() {
  }
  close(){
    this.ctrlModal.dismiss()
  }
  selecionar(item:any)
  {
    this.ctrlModal.dismiss(item)
  }
}
