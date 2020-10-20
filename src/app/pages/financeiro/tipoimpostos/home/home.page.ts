import { ProcessosService } from './../../../../services/design/processos.service';
import { TipoimpostosService } from 'src/app/services/financeiro/configuracoes/tipoimpostos.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ittipoimpostos } from 'src/app/interface/financeiro/configuracoes/ittipoimpostos';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private itemsSubscription: Subscription;

  private items = new Array<Ittipoimpostos>();
  private filtered:any[] = [];
  private queryText : string = '';
  private indexCount: number = 0;
  private carregado : Boolean = false;

  constructor(
    public serviceTipoImpostos:TipoimpostosService,
    public design:ProcessosService,
    private activatedRoute: ActivatedRoute,
  ) { 
    this.itemsSubscription = new Subscription;
  }

  ngOnInit() {
    this.itemsSubscription = this.serviceTipoImpostos.getAll().subscribe(data=>{
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
      'Confirma excluir tipo de impostos?',
      'Sim',
      'Não'
    ).then(res=>{
      if(res) {
        this.serviceTipoImpostos.delete(id).then(()=>{
          this.design.presentToast(
            'Excluido com sucesso',
            'success',
            3000
          )
        }).catch((err)=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao excluir tipo de impostos',
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
