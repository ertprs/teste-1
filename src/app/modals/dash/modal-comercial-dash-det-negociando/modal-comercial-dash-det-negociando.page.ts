import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-comercial-dash-det-negociando',
  templateUrl: './modal-comercial-dash-det-negociando.page.html',
  styleUrls: ['./modal-comercial-dash-det-negociando.page.scss'],
})
export class ModalComercialDashDetNegociandoPage implements OnInit {

  constructor(
    private ctrlModal:ModalController
  ) { }

  ngOnInit() {
  }
  closeModal()
  {
    this.ctrlModal.dismiss();
  }

}
