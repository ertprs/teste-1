import { ProcessosService } from 'src/app/services/design/processos.service';
import { DreService } from 'src/app/services/financeiro/dre.service';
import { Component, OnInit } from '@angular/core';
import { Itdre } from 'src/app/interface/financeiro/dre';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private dadosDre: Itdre = {};

  private dreSubscription: Subscription;

  constructor(
    private dreService:DreService,
    private design:ProcessosService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ) { 
    this.dreSubscription = new Subscription;
  }

  ngOnInit() {
    const dt = new Date();
    const dreId = `${dt.getMonth()+1 < 10 ? '0'+(dt.getMonth()+1) : dt.getMonth()+1}-${dt.getFullYear()}`;

    this.dreSubscription =  this.dreService.get(dreId).subscribe(data => {     
      data.receitaLiquida = data.receitas - data.impostos;
      data.ebitda = data.receitaLiquida - data.despesasOperacionais;
      data.lucroLiquido = data.ebitda - data.depreciacao - data.resultadosFinanceiros - data.irCsll;

      this.dadosDre = data;
    }); 
  }

  ngOnDestroy(){
    this.dreSubscription.unsubscribe();
  }

}
