import { ProcessosService } from 'src/app/services/design/processos.service';
import { LancamentoService } from 'src/app/services/financeiro/lancamento.service';
import { Component, OnInit } from '@angular/core';
import { Itlancamento } from 'src/app/interface/financeiro/lancamento';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.page.html',
  styleUrls: ['./financeiro.page.scss'],
})
export class FinanceiroPage implements OnInit {

  private dadosLancamento: Itlancamento = {};

  private itemsSubscription: Subscription;

  private items = new Array<Itlancamento>();
  private filtered:any[] = [];
  private queryText : string = '';
  private indexCount: number = 0;
  private carregado : Boolean = false;

  private totReceber: number = 0;
  private totPagar: number = 0;

  constructor(
    private lancamentoService:LancamentoService,
    private design:ProcessosService
  ) {
    this.itemsSubscription = new Subscription;
  }

  ngOnInit() {
    this.itemsSubscription = this.lancamentoService.getAll().subscribe(data=>{
      this.carregado = true;
      this.indexCount = 0;
      data.forEach(elem=>{
        this.indexCount++;
        if(elem.c_d === 'c') {
          this.totReceber += elem.valor_principal;
        } else {
          this.totPagar += elem.valor_principal;
        }
      })  
      this.items = data;
      this.filtered = this.items;
    });
  }

  ngOnDestroy() {
    console.log('Subscribes closed')
    this.itemsSubscription.unsubscribe();
  }

  pesquisar(event : any) {
    try {
      this.queryText = event.target.value;
      if (this.queryText == "") {
        this.filtered = this.items; // Original array with food elements can be [] also
      } else {
        const filter = this.queryText.toUpperCase();
  
        this.filtered = this.items.filter((item) => {
          for (let i = 0; i < item.parceiroNome.length; i++) {
            if (item.parceiroNome.indexOf(filter) > -1 ) {
              return item;
            }
          }
        })
      }
    } catch(err) {
      console.log(err)
      this.design.presentToast(
        'Falha ao pesquisar',
        'danger',
        4000
      )
    }
   
  }

  testarLancamento(c_d,tipoLancamento) {
    this.design.presentLoading('Inserindo...').then((resLoading)=>{
      resLoading.present();

      this.dadosLancamento.bancoNome = 'Lara Checkout';
      this.dadosLancamento.bancoUid = '5cKOMKTRuzPrbLcwl3bs';
      this.dadosLancamento.c_d = c_d;
      this.dadosLancamento.libBoleto = true;
      this.dadosLancamento.libCartao = false;
      this.dadosLancamento.situacaoCod = 7;
      this.dadosLancamento.valor_principal = 0.01;
      this.dadosLancamento.vencimento = '2020-06-30';
      this.dadosLancamento.parceiroUid = 'PMwKcVNOSpOxq5iiModY';
      this.dadosLancamento.tipoLancamentoCod = tipoLancamento;
      this.dadosLancamento.tipoLancamentoNome = 'Despesa teste';
      this.dadosLancamento.classificacaoUid = '8t1QOHYZF1nDPrMm5iXE';
      if(tipoLancamento === 1) {
        this.dadosLancamento.tipoLancamentoCod = tipoLancamento;
        this.dadosLancamento.tipoLancamentoNome = 'Imposto teste';
        this.dadosLancamento.classificacaoUid = 'HwnbwMnb93kX8koK96xx';
      }
      
      this.lancamentoService.add(this.dadosLancamento).then((res)=>{
        resLoading.dismiss();
        this.design.presentToast(
          'Lançamento inserido com sucesso.',
          'success',
          3000
        );
      }).catch((err)=>{
        resLoading.dismiss();
        this.design.presentToast(
          'Falha ao incluir Lançamento',
          'danger',
          4000
        );
      });
    }).catch((err)=>{
      console.log(err);
      this.design.presentToast(
        'Falha ao iniciar processo de inclusão',
        'danger',
        4000
      );
    });
  }

  lancamentoDetalhe(lancamentoUid) {
    console.log(`DETALHE ${lancamentoUid}`);
  }

}
