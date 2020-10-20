import { ComercialService } from 'src/app/services/comercial/comercial.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Pedidos } from 'src/app/interface/comercial/pedidos';

@Component({
  selector: 'app-modal-comercial-dash-det-leads',
  templateUrl: './modal-comercial-dash-det-leads.page.html',
  styleUrls: ['./modal-comercial-dash-det-leads.page.scss'],
})
export class ModalComercialDashDetLeadsPage implements OnInit {


  public leadsItens = new Array<Pedidos>()

  constructor(
    private ctrlModal:ModalController,
    private srvComercial:ComercialService
  ) { }

  closeModal()
  {
    this.ctrlModal.dismiss();
  }
  ngOnInit() {
  }
  ngAfterViewInit()
  {
    this.srvComercial.getAll().subscribe(dados=>{
      this.leadsItens = dados
    })
  }

}
