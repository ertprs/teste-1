import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalfiscalicmssittributaria',
  templateUrl: './modalfiscalicmssittributaria.page.html',
  styleUrls: ['./modalfiscalicmssittributaria.page.scss'],
})
export class ModalfiscalicmssittributariaPage implements OnInit {


  private listaLucroReal = [{codigo:"00",nome:"Tributada integralmente"},{codigo:"10",nome:"Tributada e com cobrança do ICMS por ST"},{codigo:"20",nome:"Com redução de base de cálculo"},{codigo:"30",nome:"Isenta/Não tributada e com cobrança do ICMS por ST"},{codigo:"40",nome:"Isenta"},{codigo:"41",nome:"Não Tributada"},{codigo:"50",nome:"Com Suspensão"},{codigo:"51",nome:"Com Diferimento"},{codigo:"60",nome:"ICMS Cobrado na Operação Anterior por Substituição Tributária"},{codigo:"70",nome:"Com redução de base de cálculo no ICMS ST"},{codigo:"90",nome:"Outras Operaçòes"},

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
