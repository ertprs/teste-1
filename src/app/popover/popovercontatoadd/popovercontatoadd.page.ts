import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popovercontatoadd',
  templateUrl: './popovercontatoadd.page.html',
  styleUrls: ['./popovercontatoadd.page.scss'],
})

export class PopovercontatoaddPage implements OnInit {
  constructor(public popoverController: PopoverController) {}

  popoverfechar()
  {
    this.popoverController.dismiss();
  }

  ngOnInit() {

  }

}
