import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalfinapoioselecionartipo',
  templateUrl: './modalfinapoioselecionartipo.page.html',
  styleUrls: ['./modalfinapoioselecionartipo.page.scss'],
})
export class ModalfinapoioselecionartipoPage implements OnInit {

  private items = []
  private relatorios = []
  constructor(
    private ctrlModal:ModalController
  ) { }

  ngOnInit() {

    this.items.push({nome:'lançamento',acao:'compfinview'})
    this.items.push({nome:'categoria',acao:'modalfincategoriaadd'})
    this.items.push({nome:'Recorrência',acao:'compfinrecorrenciahome'})
    this.items.sort(function(a:any,b:any) {
      return a < b ? -1 : a > b ? 1 : 0;
    }).forEach(dados=>{
      this.relatorios.push(dados)
    })
  }


  selecionar(acao:string)
  {
    this.ctrlModal.dismiss({acao})
  }

  close()
  {
    this.ctrlModal.dismiss()
  }

}
