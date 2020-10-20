import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modelcomapoiocondpagamento',
  templateUrl: './modelcomapoiocondpagamento.page.html',
  styleUrls: ['./modelcomapoiocondpagamento.page.scss'],
})
export class ModelcomapoiocondpagamentoPage implements OnInit {
  private  dadosCond = {
    nome:'',
    qtdParcelas:0,
    periodo_1:0,
    periodo_2:0,
    periodo_3:0,
    periodo_4:0,
    periodo_5:0,
    periodo_6:0,
    periodo_7:0,
    periodo_8:0,
    periodo_9:0,
    periodo_10:0,
    periodo_11:0,
    periodo_12:0

  }
  constructor() { }

  ngOnInit() {
  }

  
}
