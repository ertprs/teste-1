import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popoverfinitemlist',
  templateUrl: './popoverfinitemlist.page.html',
  styleUrls: ['./popoverfinitemlist.page.scss'],
})
export class PopoverfinitemlistPage implements OnInit {

  @Input() item: any;

  private cd:string = ''
  private libBoleto:boolean = false
  private libCampainha:boolean = false;
  constructor(
    private ctrlPopover:PopoverController
  ) { }

  ngOnInit() {
    this.cd = this.item.c_d;
    if(this.item.dadosBoleto.url !== undefined){this.libBoleto = true}
    if(this.item.isIntegracoesData.endPoint !== undefined){this.libCampainha = true}
   
  }

  executarAcao(acaoCod:string)
  {
    this.ctrlPopover.dismiss({acaoCod})
  }

}
