import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modall-rel-atendimento',
  templateUrl: './modall-rel-atendimento.page.html',
  styleUrls: ['./modall-rel-atendimento.page.scss'],
})
export class ModallRelAtendimentoPage implements OnInit {

  private items = []
  private relatorios = []
  constructor(
    private ctrlModal:ModalController
  ) { }

  ngOnInit() {

    this.items.push({nome:'Atendimentos',acao:'compatendimentorelatoriooperaaco'})
    this.items.push({nome:'Casos',acao:'compcasosreldetalhe'})
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

}
