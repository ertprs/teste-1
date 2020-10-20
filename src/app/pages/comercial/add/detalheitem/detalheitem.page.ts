import { ProcessosService } from 'src/app/services/design/processos.service';
import { ComercialService } from './../../../../services/comercial/comercial.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pedidositens } from 'src/app/interface/comercial/pedidositens';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalheitem',
  templateUrl: './detalheitem.page.html',
  styleUrls: ['./detalheitem.page.scss'],
})
export class DetalheitemPage implements OnInit {
  public itemUid: string = null;
  public pedidoUid: string = null;
  public dadosItem: Pedidositens = {};
  public dadosSubscription: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private sericeComercial:ComercialService,
    private design:ProcessosService
  ) 
  {
    this.itemUid = this.activatedRoute.snapshot.params['itemUid']; 
    this.pedidoUid = this.activatedRoute.snapshot.queryParamMap.get('pedido');
    console.log('Abrindo tela de contato | '+this.itemUid);

    if(this.itemUid)
    {
      console.log('Abrindo item '+this.itemUid);
      this.dadosSubscription = this.sericeComercial.getItem(this.pedidoUid,this.itemUid).subscribe(data=>{
        this.dadosItem = data;
      })
      
    }
   }
  
  calculando()
  {
    try{
      let qtd = this.dadosItem.qtd;
      let vrUnit = this.dadosItem.vrUnitario;
      let vrTotal = vrUnit*qtd;

      this.dadosItem.vrTotal = vrTotal;
    }
    catch(err)
    {
      this.dadosItem.vrTotal = 0;
    }
    
  }
  ngOnInit() {
  }

  atualizar(){
    this.sericeComercial.updateItem(this.pedidoUid,this.itemUid,this.dadosItem)
    .then((res)=>{

      //Ajustar valores
      this.sericeComercial.calcularTotalPedido(this.pedidoUid);

      this.design.presentToast(
        'Item atualizado',
        'success',
        3000
      )
    })
    .catch((err)=>{
      console.log(err)  
      this.design.presentToast(
        'Falha ao atualizar dados ',
        'danger',
        4000
        )

    })
  }

}
