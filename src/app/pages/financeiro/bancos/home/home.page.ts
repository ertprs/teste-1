import { ProcessosService } from './../../../../services/design/processos.service';
import { BancoService } from 'src/app/services/financeiro/configuracoes/banco.service';
import { LancamentoService } from 'src/app/services/financeiro/lancamento.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Itbanco } from 'src/app/interface/financeiro/configuracoes/itbanco';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private itemsSubscription: Subscription;

  private items = new Array<Itbanco>();
  private filtered:any[] = [];
  private queryText : string = '';
  private indexCount: number = 0;
  private carregado : Boolean = false;

  constructor(
    private lancamentoService:LancamentoService,
    public bancoService:BancoService,
    public design:ProcessosService,
    private activatedRoute: ActivatedRoute,
  ) { 
    this.itemsSubscription = new Subscription;
  }

  ngOnInit() {
    this.itemsSubscription = this.bancoService.getAll().subscribe(data=>{
      this.carregado = true;
      this.indexCount = 0;
      data.forEach(elem=>{
        this.indexCount++;
      })  
      this.items = data;
      this.filtered = this.items;
    });
  }

  ngOnDestroy() {
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
          for (let i = 0; i < item.nome.length; i++) {
            if (item.nome.indexOf(filter) > -1 ) {
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

  deletar(id:string) {
    this.design.presentAlertConfirm(
      'Excluir',
      'Confirma excluir este banco?',
      'Sim',
      'Não'
    ).then(res=>{
      if(res) {
        console.log(id);
        this.lancamentoService.lancamentoDb.where('bancoUid','==',id).get().then((res2) => {
          console.log(res2);
          console.log(res2.size);
          console.log(res2.empty);
          if(res2.empty) {
            this.bancoService.delete(id).then(()=>{
              this.design.presentToast(
                'Excluido com sucesso',
                'success',
                3000
              )
            }).catch((err)=>{
              console.log(err)
              this.design.presentToast(
                'Falha ao excluir banco',
                'danger',
                4000
              )
            })
          } else {
            this.design.presentToast(
              'Este banco possui lançamentos vinculados',
              'warning',
              3000
            )
          }
        }).catch(err=>{
          console.log(err);
          this.design.presentToast(
            'Falha ao validar possibilidade de exclusão',
            'danger',
            4000
          )
        })
      }
    }).catch(err=>{
      console.log(err);
      this.design.presentToast(
        'Falha ao tentar confirmação de exclusão',
        'danger',
        4000
      )
    })
  }

}
