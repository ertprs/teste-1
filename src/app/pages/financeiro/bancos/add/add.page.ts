import { ProcessosService } from 'src/app/services/design/processos.service';
import { BancoService } from 'src/app/services/financeiro/configuracoes/banco.service';
import { Component, OnInit } from '@angular/core';
import { Itbanco } from 'src/app/interface/financeiro/configuracoes/itbanco';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  private dadosBanco: Itbanco = {};
  
  private bancos: any = [];
  private bancosSubscription: Subscription;

  private bancoUid: string = null;
  private itemsSubscriptionAdd: Subscription;

  constructor(
    private bancoService:BancoService,
    private design:ProcessosService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ) { 

    this.itemsSubscriptionAdd = new Subscription;
    this.bancosSubscription = new Subscription;
    this.bancoUid = this.activatedRoute.snapshot.params['bancoUid']; 
    
  }

  ngOnInit() {
    
    this.bancosSubscription =  this.bancoService.getBancos().subscribe(data => {     
      this.bancos = data;
    });

    if(this.bancoUid) { 
      this.itemsSubscriptionAdd =  this.bancoService.get(this.bancoUid).subscribe(data => {     
        this.dadosBanco = data;
      }); 
    }
  }
  ngOnDestroy(){
    this.itemsSubscriptionAdd.unsubscribe();
    this.bancosSubscription.unsubscribe();
  }

  atualizar() {
    this.design.presentLoading('Atualizando...').then(resLoading=>{
      resLoading.present();
      this.bancoService.update(this.bancoUid,this.dadosBanco).then(res=>{
        resLoading.dismiss();
        this.design.presentToast(
          'Atualizado com sucesso',
          'success',
          3000
        );
      }).catch(err=>{
        resLoading.dismiss();
        console.log(err);
        this.design.presentToast(
          'Falha ao atualizar dados',
          'danger',
          4000
        );
      });
    });
  }

  submitForm(){
    this.design.presentLoading('Inserindo...').then((resLoading)=>{
      resLoading.present();

      this.dadosBanco.nome = this.bancos.filter(item=> item.cod == this.dadosBanco.codBanco).shift().nome;
      this.dadosBanco.ativo = true;
      this.dadosBanco.padrao = false;
      this.dadosBanco.isIntegracao = false;
      this.dadosBanco.isIntegracaoData = '';

      this.bancoService.add(this.dadosBanco).then((res)=>{
        resLoading.dismiss();
        this.bancoUid = res.id;
        this.design.presentToast(
          'Banco inserido com sucesso.',
          'success',
          3000
        );
        this.router.navigate([`financeiro/bancos`]);
      }).catch((err)=>{
        resLoading.dismiss();
        this.design.presentToast(
          'Falha ao incluir banco',
          'danger',
          4000
        );
      });
    }).catch((err)=>{
      console.log(err);
      this.design.presentToast(
        'Falha ao iniciar processo de inclusão',
        'danger',
        4000
      );
    });
  }

}
