import { PopoverController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-popovercontatoshomeopcoesitensselecionados',
  templateUrl: './popovercontatoshomeopcoesitensselecionados.page.html',
  styleUrls: ['./popovercontatoshomeopcoesitensselecionados.page.scss'],
})
export class PopovercontatoshomeopcoesitensselecionadosPage implements OnInit {
  @Input() qtdItens: any;
  public qtdSelecionado:number;
  constructor(
    private ctrlPopover:PopoverController
  ) { }

  ngOnInit() {
    this.qtdSelecionado = 0;
    this.qtdItens.forEach(element => {
      if(element.selecionado)
      {
        this.qtdSelecionado++;
      }
    });

  }
  
  acao(acao:string)
  {
    this.ctrlPopover.dismiss(acao);
  }
}
