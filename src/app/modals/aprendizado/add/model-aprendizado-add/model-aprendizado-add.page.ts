import { AprendizadoService } from 'src/app/services/lara/aprendizado.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ProdutosService } from 'src/app/services/produtos/produtos.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Aprendizado } from 'src/app/interface/lara/aprendizado';
import { Subscription } from 'rxjs';
import { Exemploia } from 'src/app/interface/lara/aprendizado/exemploia';
import { Itproduto } from 'src/app/interface/produtos/itproduto';

@Component({
  selector: 'app-model-aprendizado-add',
  templateUrl: './model-aprendizado-add.page.html',
  styleUrls: ['./model-aprendizado-add.page.scss'],
})
export class ModelAprendizadoAddPage implements OnInit {
  @Input() aprendizadoUid: string;

  public dadosAprendizado: Aprendizado = {};
  public exemplos = new Array<Exemploia>();
  public aprendizadoSubscription: Subscription;
  public aprendizadoExemploSubscription: Subscription;
  public dadosAprendizadoExemplo: Exemploia = {};

  private produtosSubscription: Subscription;
  private dadosProdutos = new Array<Itproduto>();

  constructor(
    private ctrModal:ModalController,
    private design:ProcessosService,
    private produtosService:ProdutosService,
    private srvAprendizado:AprendizadoService
  ) { 
    this.produtosSubscription = new Subscription;
  }

  ngOnInit() {
    if(this.aprendizadoUid)
    {
      console.log('Abrindo '+this.aprendizadoUid);
      this.loadDados();
    } else {
      this.dadosAprendizado.valorOportunidade = 0;
      this.dadosAprendizado.tipo = 'contato';
      this.dadosAprendizado.acao = 'texto';
    }
  }
  loadDados(){
    console.log('Abrindo dados do aprendizado');
    this.aprendizadoSubscription = this.srvAprendizado.get(this.aprendizadoUid).subscribe(data => {
     
      this.dadosAprendizado = data;
      if(this.dadosAprendizado.valorOportunidade === undefined) this.dadosAprendizado.valorOportunidade = 0;
      
      this.loadDadosExemplo();
     
    })
  }
  loadDadosExemplo()
  {
    console.log('Abrindo exemplos de '+this.aprendizadoUid);
    this.aprendizadoExemploSubscription = this.srvAprendizado.getAllExemplos(this.aprendizadoUid).subscribe(data => {
     
      this.exemplos = data;
      
      
    })
  }
  closeModal()
  {
    this.ctrModal.dismiss();
  }

  ensinar()
  {
    // console.log(this.dadosAprendizado);
    if(this.aprendizadoUid)
    {
      //Atuaizar
      this.design.presentLoading('Atualizando...')
      .then(resLoading=>{
        resLoading.present();
        this.dadosAprendizado.valorOportunidade = parseFloat(this.dadosAprendizado.valorOportunidade.toString().replace(',','.'));
        this.srvAprendizado.update(this.aprendizadoUid,this.dadosAprendizado)
        .then(resAtualizacao=>{
          this.design.presentToast(
            'Atualizado com sucesso',
            'success',
            3000
          )
        })
        .catch(err=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao atualizar dados do aprendizado',
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
    else
    {
      //NOVO
      this.design.presentLoading('Ensinando...')
      .then(resLoading=>{
        resLoading.present();
        this.dadosAprendizado.valorOportunidade = parseFloat(this.dadosAprendizado.valorOportunidade.toString().replace(',','.'));
        this.srvAprendizado.add(this.dadosAprendizado)
        .then(res=>{
          this.aprendizadoUid = res.id;
          this.design.presentToast(
            'Recebi o ennsinamento com sucesso',
            'success',
            3000
          )
        })
        .catch(err=>{
          console.log(err);
          this.design.presentToast(
            'Houve um problema ao ensinar',
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
   
   
  }
  addExemplo()
  {
    this.design.presentLoading('Adicionando...')
    .then(resLoading=>{
      resLoading.present();
      const add = this.srvAprendizado.addExemplo(this.aprendizadoUid,this.dadosAprendizadoExemplo);
      add.then((res)=>{
        
        this.design.presentToast(
          "Exemplo adicionado ",
          "success",
          2000
          )
          this.dadosAprendizadoExemplo.exemplo = '';
      })
      .catch((err)=>{
        console.log(err)
        this.design.presentToast(
          "Falha ao excluir exemplo ",
          "danger",
          4000
          )
      })
      .finally(()=>{
        resLoading.dismiss();
      })
    })
   
  }
  delete(id:string)
  {
    this.design.presentAlertConfirm(
      "Excluir",
      "Confirma excluir este exemplo?",
      "Pode!",
      "Nem pensar..."
    )
    .then((res)=>{
      if(res)
      {
        this.design.presentLoading('Deletando...')
        .then(resLoading=>{
          resLoading.present()
          this.srvAprendizado.deleteExemplo(this.aprendizadoUid,id)
          .then(()=>{
            this.design.presentToast(
              "Deletado com sucesso",
              "success",
              2000
            )
          })
          .catch((err)=>{
            console.log(err);
            this.design.presentToast("Falha ao excluir exemplo","danger",4000);
          })
          .finally(()=>{
            resLoading.dismiss()
          })
          
        })
        
      }
    })
  }

  tipoChange(event) {
    if(this.dadosAprendizado.tipo.toUpperCase() === 'COMERCIAL') {
      this.design.presentLoading('Carregando produtos...').then(resLoading=>{
        resLoading.present()
        this.produtosSubscription = this.produtosService.getAll().subscribe(data => {
          this.dadosProdutos = data;
          resLoading.dismiss();
        })
      });
    } else {
      // this.dadosAprendizado.acao = 'texto';
      // this.dadosAprendizado.acaoCod = '';
      this.dadosAprendizado.produtoUid = '';
      this.dadosAprendizado.valorOportunidade = 0;
    }
  }

  produtoChange(event) {
    if(this.dadosAprendizado.produtoUid !== '') {
      // this.dadosAprendizado.acao = 'robo';
      // this.dadosAprendizado.acaoCod = '46';
      this.design.presentLoading('Carregando dados...').then(resLoading=>{
        resLoading.present()
        this.produtosService.get(this.dadosAprendizado.produtoUid).subscribe(data => {
          this.dadosAprendizado.valorOportunidade = data.vrVenda;
          resLoading.dismiss();
        })
      });
    }
  }
}
