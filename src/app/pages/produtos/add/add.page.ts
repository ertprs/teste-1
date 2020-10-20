import { ActivatedRoute, Router } from '@angular/router';
import { ProdutosService } from './../../../services/produtos/produtos.service';
import { Itproduto } from './../../../interface/produtos/itproduto';
import { Component, OnInit } from '@angular/core';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  public dadosProduto: Itproduto = {};
  private produtoId: string = null;
  private produtoSubscription: Subscription;

  

  constructor(
    private produtoService:ProdutosService,
    private design:ProcessosService,
    private activatedRoute:ActivatedRoute,
    private router:Router
  ) { 

    this.produtoId = this.activatedRoute.snapshot.params['produtoUid']; 
    if (this.produtoId) this.loadProduto();
  }

  ngOnInit() {
  }
  loadProduto(){
    this.design.presentLoading('Carregando...')
    .then((resloading)=>{
      resloading.present();
      this.produtoSubscription = this.produtoService.get(this.produtoId).subscribe(data => {
        resloading.dismiss();
        this.dadosProduto = data;
      });
    })
    .catch((err)=>{
      console.log(err);
      this.design.presentToast(
        
        'Falha ao carregar dados do produto ',
        'danger',
        4000
      )
    })
  }
  async atualizar()
  {
    this.design.presentLoading('Salvando...')
    .then((resloading)=>{
      resloading.present();
      this.produtoService.update(this.produtoId,this.dadosProduto)
      .then(()=>{
        this.design.presentToast(
          'Atualizado! ',
          'success',
          3000
        )
      })
      .catch((err)=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao atualizar produto',
          'danger',
          3000
        )
      })
      .finally(()=>{
        resloading.dismiss();
      })
    })
  }
  async deletar()
  {
    this.design.presentAlertConfirm(
      'Excluir',
      'Confirma excluir este produto?',
      'Pode!',
      'Nem pensar.'
    )
    .then((res)=>{
      if(res)
      {
        //deletar
        alert('deletar');
        this.produtoService.delete(this.produtoId)
        .then(()=>{
          this.design.presentToast(
            'Produto deletado com sucesso ',
            'success',
            3000
          )
          this.router.navigate(['/produtos'])
        })
        .catch((err)=>{
          console.log(err);
          this.design.presentToast(
            'Falha ao deletar produto ',
            'danger',
            3000
          )
        })
      }
     
    })
    .catch((err)=>{
        console.log(err);
        
    })
  }
  async add()
  {
    console.log(this.dadosProduto);
    await this.design.presentLoading('Gravando...')
    .then((res)=>{
      res.present();
      this.produtoService.add(this.dadosProduto)
      .then((data)=>{
        this.produtoId = data.id
        this.design.presentToast(
          'Produto cadastrado com sucesso ',
          'success',
          3000
        )
      })
      .catch((err)=>{
        this.design.presentToast(
          'Falha ao cadastrar produto ',
          'danger',
          3000
        )
      })
      .finally(()=>{
        res.dismiss();
      })
    })
  }

}
