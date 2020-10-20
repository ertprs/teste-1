import { ComercialService } from 'src/app/services/comercial/comercial.service';
import { ProcessosService } from './../../../services/design/processos.service';
import { ProdutosService } from './../../../services/produtos/produtos.service';
import { Itproduto } from './../../../interface/produtos/itproduto';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedidositens } from 'src/app/interface/comercial/pedidositens';

@Component({
  selector: 'app-modestoqueconsulta',
  templateUrl: './modestoqueconsulta.page.html',
  styleUrls: ['./modestoqueconsulta.page.scss'],
})
export class ModestoqueconsultaPage implements OnInit {
 
  @Input() dadosPedido:any;
  public dadosProduto = new Array<Itproduto>();
  private dadosProdutoSubscription: Subscription;
  public filtered = new Array<Itproduto>();
  public dadosPedidoItem:Pedidositens = {}
  constructor(
    private ctrModal:ModalController,
    private srvProduto:ProdutosService,
    private design:ProcessosService,
    private srvComercial:ComercialService
  ) { }

  ngOnInit() {
    this.dadosProdutoSubscription = this.srvProduto.getAll().subscribe(data=>{
      if(data.length > 0)
      {
        this.dadosProdutoSubscription.unsubscribe()
        this.dadosProduto = data;
        this.filtered = this.dadosProduto;
      }
    })
  
  }
  closeModal(){
    this.ctrModal.dismiss();
  }
  AdicionarProdutoPedido(dadosProduto:Itproduto)
  {
    
    
    this.dadosPedidoItem.pedidoUid        = this.dadosPedido["id"]
    this.dadosPedidoItem.photoUrl         = dadosProduto.photo
    this.dadosPedidoItem.produtoDescricao = dadosProduto.descricaoLonga
    this.dadosPedidoItem.produtoUid       = dadosProduto["id"]
    this.dadosPedidoItem.qtd              = 1
    this.dadosPedidoItem.vrTotal          = dadosProduto.vrVenda
    this.dadosPedidoItem.vrUnitario       = dadosProduto.vrVenda

    console.log(this.dadosPedidoItem)
    if(this.dadosPedido)
    {
      
      this.srvComercial.PedidosItensAdd(this.dadosPedido["id"] ,this.dadosPedidoItem,"SP")
      .then(resAdd=>{
        if(resAdd)
        {
          this.closeModal();
          this.design.presentToast(
            'Item adicionado com sucesso',
            'success',
            3000
          )
        }
        else
        {
          this.design.presentToast(
            'Falha ao inserir item',
            'danger',
            0,
            true
          )
        }
        
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Falha ao inserir item',
          'danger',
          0,
          true
        )
      })
      
    }
    else
    {
      this.design.presentToast(
        'Não foi identificado uma origem de seleção',
        'secondary',
        0,
        true
      )
    }
  }
  selecionar(dadosProduto:Itproduto){
    if(this.dadosPedido)
    {
      console.log(this.dadosPedido)
      this.AdicionarProdutoPedido(dadosProduto)
    }
    else
    {
      this.design.presentToast(
        'Não foi identificado uma origem de seleção',
        'secondary',
        0,
        true
      )
    }
  }

}
