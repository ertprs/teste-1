import { ItConfigWatson } from './../../../../interface/configuracoes/chat/it-config-watson';
import { ModalController } from '@ionic/angular';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Component, OnInit } from '@angular/core';
import { Aprendizado } from 'src/app/interface/lara/aprendizado';
import { Subscription } from 'rxjs';
import { AprendizadoService } from 'src/app/services/lara/aprendizado.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ModelAprendizadoAddPage } from 'src/app/modals/aprendizado/add/model-aprendizado-add/model-aprendizado-add.page';



@Component({
  selector: 'app-comp-aprendizado-home',
  templateUrl: './comp-aprendizado-home.component.html',
  styleUrls: ['./comp-aprendizado-home.component.scss'],
})
export class CompAprendizadoHomeComponent implements OnInit {

  public aprendizados = new Array<Aprendizado>();

 

  private aprendizadosSubscription: Subscription;

  public dadosAprendizado: Aprendizado = {};
  private confiabilidadeValue:number=0
  public confiablidadeBloc:boolean = false;
  
  public  confIaSubscribe: Subscription;
  public confIA: ItConfigWatson = {};




  public produtitidadeSubscriptio:Subscription;
  public produtividadeDados: any = {msgRecebida:0,msgRespondidades:0,percetual:0}
  constructor(
    private eventEmitterService:ProvEmitterEventService,
    public serviceAprendizado:AprendizadoService,
    public design:ProcessosService,
    private ctrlModal:ModalController

  ) { }

  ngOnInit() {
    this.aprendizadosSubscription = this.serviceAprendizado.getAll().subscribe(data=>{
        
      this.aprendizados = data;
    });
    //DADOS DE CONFIGURACAO
    this.confIaSubscribe =  this.serviceAprendizado.getConfWatson().subscribe(elem=>{
     elem.forEach(dados=>{
        this.confiabilidadeValue = dados.confiabilidade;
        this.confIA = dados;
     })

     //DADOS DE PRODUTIVIDADE
     this.getProdutividade();
     
   })
   
  

   

    
  }

  testeAugustoComit(){

  }
  
  getProdutividade()
  {
    let Proc = this.serviceAprendizado.getProdutividade();
    if(Proc.situacao == 'suc')
    {
      this.produtividadeDados = Proc["data"];
    }
    else
    {
      console.log(Proc.msg);
      this.design.presentToast(
        'Falha ao carregar dados de produtividade',
        'warning',
        0,
        true
      )
    }
  }
  unlock()
  {
    this.confiablidadeBloc = true;
  }
  ConfiabilidadeSave()
  {
    let value = this.confiabilidadeValue;
    this.design.presentLoading('Preparando...')
    .then(resLoading=>{
      resLoading.present()
      this.confIA.confiabilidade = value;
      this.serviceAprendizado.updateConfIA(this.confIA)
      .then(res=>{
        console.log(value)
        this.confiablidadeBloc = false;
        this.design.presentToast(
          'Confiabilidade ajustada com sucesso!',
          'success',
          3000
        )
      })
      .catch(err=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao preparar confiabilidade',
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
  abrirDetalheAprendizado(dados:Aprendizado)
  {
    alert('Detalhes do aprendizado')
  }
  ngOnDestroy(){
    this.aprendizadosSubscription.unsubscribe();
    this.confIaSubscribe.unsubscribe();
  }
  functionExecute(functionName:string,params:any)
  {
    console.log('preparando '+functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }


  async abrirInfo(id:string) {
    console.log('editar dados')
    const modal = await this.ctrlModal.create({
      component: ModelAprendizadoAddPage,
      cssClass: 'selector-modal',
      backdropDismiss:true,
      componentProps: {
        aprendizadoUid:id
      }
    });
    return await modal.present();
  }

  changeConfiabilidade(event:any){
    let value = event.detail.value;
    this.confiabilidadeValue  = value;
  
  }

  async novo() {
    console.log('editar dados')
    const modal = await this.ctrlModal.create({
      component: ModelAprendizadoAddPage,
      cssClass: 'selector-modal',
      backdropDismiss:true
    });
    return await modal.present();
  }

}
