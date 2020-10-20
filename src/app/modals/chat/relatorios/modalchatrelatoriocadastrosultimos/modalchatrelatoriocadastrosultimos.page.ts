import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modalchatrelatoriocadastrosultimos',
  templateUrl: './modalchatrelatoriocadastrosultimos.page.html',
  styleUrls: ['./modalchatrelatoriocadastrosultimos.page.scss'],
})
export class ModalchatrelatoriocadastrosultimosPage implements OnInit {



  @Input() titulo: string;
  @Input() itens: any;

  public exibirUltimos:boolean = true;

  constructor(
     private ctrlModal:ModalController
  ) { }
  closeModal()
  {
    this.ctrlModal.dismiss();
  }
  ngOnInit() {
    
  }



}
