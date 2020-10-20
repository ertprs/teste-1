import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-acessonegado',
  templateUrl: './acessonegado.page.html',
  styleUrls: ['./acessonegado.page.scss'],
})
export class AcessonegadoPage implements OnInit {
  @Input() permissoes: any;
  @Input() componenteNome: any;
  constructor(
    private ctrlModel:ModalController
  ) { }

  ngOnInit() {
  }
  close(){
    this.ctrlModel.dismiss();
  }
}
