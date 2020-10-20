import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalcomapoiohistorico',
  templateUrl: './modalcomapoiohistorico.page.html',
  styleUrls: ['./modalcomapoiohistorico.page.scss'],
})
export class ModalcomapoiohistoricoPage implements OnInit {

  constructor(
    private ctrModal:ModalController
  ) { }

  ngOnInit() {
  }
  closeModel()
  {
    this.ctrModal.dismiss()
  }
}
