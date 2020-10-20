import { ComercialService } from './../../../services/comercial/comercial.service';
import { LoadingController } from '@ionic/angular';
import { ProdutosService } from './../../../services/produtos/produtos.service';
import { Component, OnInit } from '@angular/core';
import { Itproduto } from 'src/app/interface/produtos/itproduto';
import { Subscription } from 'rxjs';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ActivatedRoute } from '@angular/router';
import { Pedidositens } from 'src/app/interface/comercial/pedidositens';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  public produtos = new Array<Itproduto>();
 

  public dadosComercialItens: Pedidositens = {};
  private produtosSubscription: Subscription;
  public pedidoUid:string = '';

  constructor(
    private produtosService:ProdutosService,
    private design:ProcessosService,
    private designLoader:LoadingController,
    private activatedRoute: ActivatedRoute,
    private serviceComercial:ComercialService
    
  ) { 
    
    this.pedidoUid = this.activatedRoute.snapshot.queryParamMap.get('pedido');
  

    this.design.presentLoading(
      'Aguarde...'
    )
    .then((res)=>{
      res.present();
      this.carregarDados()
      .then(()=>{
        
      })
      .catch(()=>{

      })
      .finally(()=>{
        res.dismiss();
      })
    })

    
  }
  selecionar(uid:string)
  {
    if(this.pedidoUid)
    {
      //VINCULAR ITEM AO PEDIDO 
      this.design.presentLoading('Inserindo...')
      .then((resloading)=>{
        resloading.present();
        this.dadosComercialItens.produtoUid = uid;
        this.serviceComercial.PedidosItensAdd(this.pedidoUid,this.dadosComercialItens)
        .then((res)=>{
          if(res)
          {
            this.design.presentToast(
              'Item adicionado. Informe dados adicionais',
              'success',
              3000
            )
          }
          else
          {
            this.design.presentToast(
              'Falha ao adicionar item ',
              'danger',
              4000
            )
          }
          
        })
        .catch((err)=>{
          this.design.presentToast(
            'Falha ao incluir item',
            'danger',
            4000
          )
        })
        .finally(()=>{
          resloading.dismiss();
        })

      })

    }
    else
    {
      alert('Não tem ação para o clique '+this.pedidoUid)
    }
  }
  async carregarDados():Promise<Boolean>
  {
    return new Promise((resolve, reject) => {
      try
      {
        this.produtosSubscription = this.produtosService.getAll().subscribe(data=>{
        
          this.produtos = data;
        });
      }
      catch(err)
      {
        
      }
      finally
      {
        resolve(true);
      }
    })
     
  

  }
  ngOnInit() {
  }
  ngOnDestroy()
  {
    this.produtosSubscription.unsubscribe()
  }

}
