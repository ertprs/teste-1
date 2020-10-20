import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalchatlistarel',
  templateUrl: './modalchatlistarel.page.html',
  styleUrls: ['./modalchatlistarel.page.scss'],
})
export class ModalchatlistarelPage implements OnInit {

  constructor(
    private ctrlModal:ModalController
  ) { }

  ngOnInit() {
  }
  closeModal(){
    this.ctrlModal.dismiss()
  }

}
