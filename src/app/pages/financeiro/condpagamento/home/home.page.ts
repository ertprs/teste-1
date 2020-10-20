import { ProcessosService } from './../../../../services/design/processos.service';
import { CondpagamentoService } from './../../../../services/financeiro/configuacoes/condpagamento.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Itcondpagamento } from 'src/app/interface/financeiro/configuracoes/itcondpagamento';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
 
  public itemsSubscription: Subscription;

  public items = new Array<Itcondpagamento>();
  public filtered:any[] = [];
  public queryText : string = '';
  public indexCount: number = 0;
  public carregado : Boolean = false;

  constructor(
    public serviceCondPagamento:CondpagamentoService,
    public design:ProcessosService,
    private activatedRoute: ActivatedRoute,
  ) 
  { 
    this.itemsSubscription = new Subscription;
  }

  ngOnInit() {

    this.itemsSubscription = this.serviceCondPagamento.getAll().subscribe(data=>{
      this.carregado = true;
      this.indexCount = 0;
      data.forEach(elem=>{
        this.indexCount++;
      })  
      this.items = data;
      this.filtered = this.items;
    });


  }
  ngOnDestroy(){
    console.log('Subscribes closed')
    this.itemsSubscription.unsubscribe();
  }
  pesquisar(event : any){
    try
    {
      this.queryText = event.target.value;
      if (this.queryText == "") {
        this.filtered = this.items; // Original array with food elements can be [] also
      }
      else{
        const filter = this.queryText.toUpperCase();
  
        this.filtered = this.items.filter((item) => {
          for (let i = 0; i < item.nome.length; i++) {
           
            
            if (item.nome.indexOf(filter) > -1 ) {
              return item.nome;
            }
          }
        })
      }
    }
    catch(err)
    {
      console.log(err)
      this.design.presentToast(
        'Falha ao pesquisar',
        'danger',
        4000
      )
    }
   
  }

  deletar(id:string)
  {
    this.design.presentAlertConfirm(
      'Excluir',
      'Confirma excluir cond. de pagamento?',
      'Sim',
      'Não'
    )
    .then(res=>{
      if(res)
      {
        this.serviceCondPagamento.delete(id)
        .then(()=>{
          this.design.presentToast(
            'Excluido com sucesso',
            'success',
            3000
          )
        })
        .catch((err)=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao excluir condição',
            'danger',
            4000
          )
        })
      }
    })
    .catch(err=>{
      console.log(err);
      this.design.presentToast(
        'Falha ao tentar confirmação de exclusão',
        'danger',
        4000
      )
    })
  }



}
