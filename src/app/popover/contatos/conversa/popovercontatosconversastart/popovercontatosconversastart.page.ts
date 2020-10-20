import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popovercontatosconversastart',
  templateUrl: './popovercontatosconversastart.page.html',
  styleUrls: ['./popovercontatosconversastart.page.scss'],
})
export class PopovercontatosconversastartPage implements OnInit {

  constructor(
    private ctrlPopove:PopoverController
  ) { }

  ngOnInit() {
  }
  selecionar(canal:string)
  {
    
    this.ctrlPopove.dismiss(canal)
  }
}
