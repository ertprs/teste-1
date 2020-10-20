
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pedido-det-produtos',
  templateUrl: './pedido-det-produtos.page.html',
  styleUrls: ['./pedido-det-produtos.page.scss'],
})
export class PedidoDetProdutosPage implements OnInit {

  
  @Input() itensVisitados: any;

  public itens = new  Array<{codigo,descricaoCurta,descricaoLonga,sku,vrVenda,createAt}>();
  constructor(
    private ctrlModel:ModalController,
    private design:ProcessosService
  ) 
  { }

  ngOnInit() {
    if(this.itensVisitados)
    {

      this.itensVisitados.forEach(element => {
        let checkProduto = this.itens.reduce( function( cur, val, index ){

          if( val.sku === element.sku && cur === -1 ) {
              
            return index;
          }
          return cur;
      
        }, -1 );
        if(checkProduto == -1)
        {
          this.itens.push(element)
        }
      });
     

      
     
    }
    else
    {
      this.design.presentToast(
        'Não existem dados para exibir',
        'secondary',
        0,
        true
      )
    }
  }
  ngAfterViewInit(){

    
    
  }
  closeModel()
  {
    this.ctrlModel.dismiss();
  }

}
