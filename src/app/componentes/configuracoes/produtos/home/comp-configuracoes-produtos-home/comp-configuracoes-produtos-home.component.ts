import { ProcessosService } from './../../../../../services/design/processos.service';
import { ProdutosService } from './../../../../../services/produtos/produtos.service';
import { Itproduto } from './../../../../../interface/produtos/itproduto';
import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comp-configuracoes-produtos-home',
  templateUrl: './comp-configuracoes-produtos-home.component.html',
  styleUrls: ['./comp-configuracoes-produtos-home.component.scss'],
})
export class CompConfiguracoesProdutosHomeComponent implements OnInit {


  private produtosSubscription: Subscription;
  public produtos = new Array<Itproduto>();


  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvProdutos:ProdutosService,
    private design:ProcessosService
  ) { }

  ngOnInit() {

  }
  ngAfterContentInit(){
    this.fristLoad();
  }
  ngOnDestroy()
  {
    this.produtosSubscription.unsubscribe();
  }
  functionExecute(functionName:string,params:any) {
    
    const param = {
      function:functionName,
      data:params
    }
    console.log(param);
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  fristLoad()
  {
    this.produtosSubscription = this.srvProdutos.getFirst().subscribe(data=>{
      this.produtos = data;
    })
  }
  search(event:any)
  {
    if(event == '')
    {
      this.fristLoad();
    }
    else
    {
   
      this.produtos = []
      this.srvProdutos.getFilter(event).subscribe(dados=>{
        dados.forEach(elem=>{
          if(elem !== undefined)
          {
            this.produtos.push(elem);
            
          }
        })
        
      })
   
    }
  }
  delete(uidProduto:Itproduto)
  {
    if(uidProduto.id !+= '')
    {
      this.design.presentAlertConfirm(
        'Excluir',
        'Confirma excluir este  produto?',
        'Pode',
        'Não',
      )
      .then(resConfirm=>{
        if(resConfirm)
        {
          this.design.presentLoading('Excluindo')
          .then(resLoading=>{
            resLoading.present();
            this.srvProdutos.delete(uidProduto.id)
            .then(resDelete=>{
              this.design.presentToast(
                'Deletado com sucesso',
                'success',
                3000
              )
            })
            .catch(err=>{
              console.log(err)
              this.design.presentToast(
                'Falha ao excluir item',
                'danger',
                0,
                true
              )
            })
            .finally(()=>{
              resLoading.dismiss();
            })
          })
          
        }
      })
     
    }
    else
    {
      this.design.presentToast(
        'Não existe um produto informado',
        'warning',
        4000
      )
    }
  }
  
}
