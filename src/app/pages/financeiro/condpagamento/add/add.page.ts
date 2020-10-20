import { ProcessosService } from './../../../../services/design/processos.service';
import { CondpagamentoService } from './../../../../services/financeiro/configuacoes/condpagamento.service';
import { Component, OnInit } from '@angular/core';
import { Itcondpagamento } from 'src/app/interface/financeiro/configuracoes/itcondpagamento';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  public  dadosCond: Itcondpagamento = {};

  public condUid: string = null;
  private itemsSubscriptionAdd: Subscription;



  constructor(
    public serviceCondPagamento:CondpagamentoService,
    public design:ProcessosService,
    private activatedRoute: ActivatedRoute,
  ) { 

    this.itemsSubscriptionAdd = new Subscription;
    this.condUid = this.activatedRoute.snapshot.params['condUid']; 
    if(this.condUid) { this.loadDados() }
  }

  ngOnInit() {


  }
  ngOnDestroy(){
    console.log('Subscribes closed')
    this.itemsSubscriptionAdd.unsubscribe();
  }

  loadDados()
  {
    this.itemsSubscriptionAdd =  this.serviceCondPagamento.get(this.condUid).subscribe(data => {
     
      this.dadosCond = data;
      
     
    })
  }
  atualizar()
  {
    this.design.presentLoading('Atualizando...')
    .then(resLoading=>{
      resLoading.present();
      this.serviceCondPagamento.update(this.condUid,this.dadosCond)
      .then(res=>{
        this.design.presentToast(
          'Atualizado com sucesso',
          'success',
          3000
          )
      })
      .catch(err=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao atualizar dados',
          'danger',
          4000
        )
      })
      .finally(()=>{
        resLoading.dismiss();
      })
    })
  }
  submitForm(){
      this.design.presentLoading('Inserindo...')
      .then((resLoading)=>{
        resLoading.present();
        this.serviceCondPagamento.add(this.dadosCond)
        .then((res)=>{
          console.log(res.id);
          this.condUid = res.id;
          this.design.presentToast(
            'Condição inserida com sucesso.',
            'success',
            3000
            )
        })
        .catch((err)=>{
          this.design.presentToast(
            'Falha ao incluir condição',
            'danger',
            4000
          )
        })
        .finally(()=>{
          resLoading.dismiss();
        })

      })
      .catch((err)=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao iniciar processo de inclusão',
          'danger',
          4000
        )
      })
  }

}
