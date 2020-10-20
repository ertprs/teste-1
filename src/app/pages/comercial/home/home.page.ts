import { ProcessosService } from './../../../services/design/processos.service';

import { Component, OnInit } from '@angular/core';
import { Pedidos } from 'src/app/interface/comercial/pedidos';
import { ComercialService } from './../../../services/comercial/comercial.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private items = new Array<Pedidos>();
  private itemsSubscription: Subscription;
  private totOportunidades :any = 0;
  private totOportunidadesOrcado :any = 0;
  private totOportunidadesFaturado :any = 0;

  public carregado: Boolean = false;

  public queryText : string = '';
  public filtered:any[] = [];

  

  constructor(
    private comercialService:ComercialService,
    private design:ProcessosService
  ) 
  { 
    ;
  }

  ngOnInit() {
    this.itemsSubscription = this.comercialService.getAll().subscribe(data=>{
      this.carregado = true;
      this.items = data;
      this.filtered = this.items;
      //somando valores de pedido 
      let totalL = 0;
      data.forEach(elem=>{
        console.log('Somando '+elem.total);
        
        if(elem.situacao == 'orcamento')
        {
          
          totalL = totalL + elem.total;
          console.log('Somando orçamentos '+totalL)
        }
        
      })
      this.totOportunidades = totalL;
      
      
    })
  }

  pedidoSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.items; // Original array with food elements can be [] also
    }
    else{
      const filter = this.queryText.toUpperCase();

      this.filtered = this.items.filter((item) => {
        if (item.contatoNome != undefined && item.contatoNome != '') {
          for (let i = 0; i < item.contatoNome.length; i++) {
            let pedidoContato = item.contatoNome || ' ';
            let pedidoCliente = item.clienteNome;
            
            if (pedidoContato.toUpperCase().indexOf(filter) > -1) {
              return item.contatoNome;
            }
          }
        }
        else {
          console.log('parceiro sem nome !');
        }
      });
    }
  }

  somarTotPedidos()
  {

  }

  delete(id:string)
  {
    this.design.presentAlertConfirm(
      'Excluir?',
      'Confirma excluir este orçamento? Não posso desfazer isso depois.',
      'Manda vê!',
      'Não não...'
    )
    .then((res)=>{
      if(res)
      {
        this.comercialService.delete(id)
        .then(()=>{
          this.design.presentToast(
            'Pronto! Foi deletado...',
            'success',
            4000
          )
        })
        .catch((err)=>{
          this.design.presentToast(
            'Falha ao deletar orçaento ',
            'danger',
            4000
          )
        })
      }
      
      
    })
    .catch((err)=>{

    })
    
  }

}
