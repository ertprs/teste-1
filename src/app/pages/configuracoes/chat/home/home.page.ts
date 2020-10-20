import { ConfempresaService } from './../../../../services/configuracoes/confempresa.service';
import { Component, OnInit } from '@angular/core';
import { Itempresaconf } from 'src/app/interface/empresa/itempresaconf';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public dadosConf :Itempresaconf = {};
  public confSubscription: Subscription;
  constructor(
    public serviceConfEmpresa:ConfempresaService
  ) { }

  ngOnInit() {
    try{
      this.confSubscription = this.serviceConfEmpresa.getCofiguracoes().subscribe(elem=>{
        this.dadosConf = elem
      })
    }
    catch(err)
    {
      console.log(err);
    }
    
  }

}
