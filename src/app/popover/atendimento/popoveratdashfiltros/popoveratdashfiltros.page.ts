import { PopoverController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-popoveratdashfiltros',
  templateUrl: './popoveratdashfiltros.page.html',
  styleUrls: ['./popoveratdashfiltros.page.scss'],
})
export class PopoveratdashfiltrosPage implements OnInit {

  @Input() ckselecionar: boolean;
  
  public ckselecionar2:boolean;
  
  constructor(
    private ctrPopover:PopoverController
  ) { }
  acaoExecutar(acao:string)
  {
    this.ctrPopover.dismiss(acao)
  }
  selecionarTodos(){
    
  }
  ngOnInit() {
    if(this.ckselecionar)
    {
      this.ckselecionar2 = this.ckselecionar
    }
    else
    {
      this.ckselecionar2 = false;
    }
  }

}
