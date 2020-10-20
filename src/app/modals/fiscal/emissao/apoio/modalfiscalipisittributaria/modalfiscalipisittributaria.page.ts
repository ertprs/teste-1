import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalfiscalipisittributaria',
  templateUrl: './modalfiscalipisittributaria.page.html',
  styleUrls: ['./modalfiscalipisittributaria.page.scss'],
})
export class ModalfiscalipisittributariaPage implements OnInit {

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
