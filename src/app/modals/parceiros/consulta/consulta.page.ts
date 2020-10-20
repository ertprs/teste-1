import { Component, OnInit, Input } from '@angular/core';
import { NavParams,ModalController } from '@ionic/angular';
import { Itaddparceiro } from 'src/app/interface/parceiros/add/itaddparceiro';
import { Subscription } from 'rxjs';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Contatos } from 'src/app/interface/chat/contatos';
import { ContatosService } from 'src/app/services/chat/contatos.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

 
  private parceirosItems:any = []

  constructor(
    private ctrlModal:ModalController,
    private srvParceiro:ParceirosService,
    private design:ProcessosService
   
    

  ) { 

  }

  ngOnInit() {
  
    this.srvParceiro.parceiroConsulta('')
    .then(resConsulta=>{
      console.log(resConsulta)
      if(resConsulta.situacao == 'suc')
      {
        const data = resConsulta.data.data[0]
        data.forEach(element => {
          this.parceirosItems.push(element)
           
        });
       
      }
      else
      {
       this.design.presentToast(
         'Houve um problema ao listar parceiros, por favor tente novamente depois',
         'danger',
         0,
         true
       )
       this.ctrlModal.dismiss() 
      }
    })
    .catch(errConsulta=>{
      console.log(errConsulta)
      this.design.presentToast(
        'Houve um problema ao tentar gerar lista de consulta. Tente novamente mais tarde',
        'danger',
        0,
        true
      )
    })
  }

  ngOnDestroy(){
    
  }
 
  pesquisarParceiro(valor:string)
  {
    this.srvParceiro.parceiroConsulta(valor)
    .then(resConsulta=>{
      this.parceirosItems = []
      console.log(resConsulta)
      if(resConsulta.situacao == 'suc')
      {
        const data = resConsulta.data.data[0]
        data.forEach(element => {
          this.parceirosItems.push(element)
            console.log(element)
        });
       
      }
      else
      {
       this.design.presentToast(
         'Houve um problema ao listar parceiros, por favor tente novamente depois',
         'danger',
         0,
         true
       )
       this.ctrlModal.dismiss() 
      }
    })
    .catch(errConsulta=>{
      console.log(errConsulta)
      this.design.presentToast(
        'Houve um problema ao listar parceiros, por favor tente novamente depois',
        'danger',
        0,
        true
      )
      this.ctrlModal.dismiss() 
    })
  }
  
  

  closeModal(){
  
    this.ctrlModal.dismiss();
  }

  selecionar(dados:any)
  {
    this.ctrlModal.dismiss({dados})
  }






 
}
