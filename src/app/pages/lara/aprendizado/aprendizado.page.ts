import { ProcessosService } from './../../../services/design/processos.service';
import { AprendizadoService } from './../../../services/lara/aprendizado.service';
import { Component, OnInit } from '@angular/core';
import { Aprendizado } from 'src/app/interface/lara/aprendizado';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aprendizado',
  templateUrl: './aprendizado.page.html',
  styleUrls: ['./aprendizado.page.scss'],
})
export class AprendizadoPage implements OnInit {

  public aprendizados = new Array<Aprendizado>();
  private aprendizadosSubscription: Subscription;

  private aprendizadoUid: string = null;
  public dadosAprendizado: Aprendizado = {};

  constructor(
    public serviceAprendizado:AprendizadoService,
    public design:ProcessosService
  ) 
  { 
    this.aprendizadosSubscription  = new Subscription;

    
  }

  delete(id:string)
  {
    this.design.presentAlertConfirm(
      'Exclusão',
      'Confirma excluir este treinamento?',
      'Sim',
      'Não não ...'
    )
    .then((res)=>{
      if(res)
      {
        this.design.presentLoading('Excluindo...')
        .then(resLoading=>{
          resLoading.present();
          this.serviceAprendizado.delete(id)
          .then((resDel)=>{
            this.design.presentToast(
              'Intenção deletada com sucesso',
              'success',
              2000
            )
          })
          .catch((err)=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao deletar intenção',
              'danger',
              4000
            )
          })
          .finally(()=>{
            resLoading.dismiss()
          })
        })
        .catch((err)=>{
          console.log(err)
          this.design.presentToast(
            'Falha no processo de delete',
            'danger',
            4000
          )
        })
        
      }
    })
  }

  ngOnInit() {

    this.aprendizadosSubscription = this.serviceAprendizado.getAll().subscribe(data=>{
        
      this.aprendizados = data;
    });
  }
  ngOnDestroy(){
    this.aprendizadosSubscription.unsubscribe();
  }

}
