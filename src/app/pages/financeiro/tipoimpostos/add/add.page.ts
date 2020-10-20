import { ProcessosService } from './../../../../services/design/processos.service';
import { TipoimpostosService } from 'src/app/services/financeiro/configuracoes/tipoimpostos.service';
import { Component, OnInit } from '@angular/core';
import { Ittipoimpostos } from 'src/app/interface/financeiro/configuracoes/ittipoimpostos';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  public  dadosImpostos: Ittipoimpostos = {};

  public impostoUid: string = null;
  private itemsSubscriptionAdd: Subscription;

  constructor(
    public serviceTipoImpostos:TipoimpostosService,
    public design:ProcessosService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ) { 

    this.itemsSubscriptionAdd = new Subscription;
    this.impostoUid = this.activatedRoute.snapshot.params['impostoUid']; 
    
  }

  ngOnInit() {
    if(this.impostoUid) { this.loadDados() }
  }
  ngOnDestroy(){
    this.itemsSubscriptionAdd.unsubscribe();
  }

  loadDados()
  {
    this.itemsSubscriptionAdd =  this.serviceTipoImpostos.get(this.impostoUid).subscribe(data => {     
      this.dadosImpostos = data;
    });
  }

  atualizar() {
    this.design.presentLoading('Atualizando...').then(resLoading=>{
      resLoading.present();
      this.serviceTipoImpostos.update(this.impostoUid,this.dadosImpostos).then(res=>{
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
      this.serviceTipoImpostos.add(this.dadosImpostos).then((res)=>{
        resLoading.dismiss();
        console.log(res.id);
        this.impostoUid = res.id;
        this.design.presentToast(
          'Tipo de impostos inserido com sucesso.',
          'success',
          3000
        );
        this.router.navigate([`configuracoes/financeiro/tipoimpostos`]);
      }).catch((err)=>{
        resLoading.dismiss();
        this.design.presentToast(
          'Falha ao incluir tipo de impostos',
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
