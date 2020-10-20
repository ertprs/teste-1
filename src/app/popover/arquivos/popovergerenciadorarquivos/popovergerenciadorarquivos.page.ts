import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popovergerenciadorarquivos',
  templateUrl: './popovergerenciadorarquivos.page.html',
  styleUrls: ['./popovergerenciadorarquivos.page.scss'],
})
export class PopovergerenciadorarquivosPage implements OnInit {

  constructor(
    private ctrlPopover:PopoverController
  ) { }

  ngOnInit() {
  }

  executar(acao:string)
  {
    this.ctrlPopover.dismiss(acao)
  }

}
