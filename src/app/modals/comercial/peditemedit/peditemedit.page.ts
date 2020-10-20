import { ProcessosService } from 'src/app/services/design/processos.service';
import { ComercialService } from 'src/app/services/comercial/comercial.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedidositens } from 'src/app/interface/comercial/pedidositens';

@Component({
  selector: 'app-peditemedit',
  templateUrl: './peditemedit.page.html',
  styleUrls: ['./peditemedit.page.scss'],
})
export class PeditemeditPage implements OnInit {


  
  @Input() dadosItem:Pedidositens;
  @Input() pedidoUid:string;

  public dadosSubscription: Subscription;

  
  constructor(
    private ctrlModel:ModalController,
    private srvComercial:ComercialService,
    private design:ProcessosService
  ) { }
  closeModel(){
  
    this.ctrlModel.dismiss();
  }
  ngOnInit() {
    
   
  }
  calculando(){
    let qtd                 = this.dadosItem.qtd;
    let vrUnitario          = this.dadosItem.vrUnitario;
    let vrTotal             = vrUnitario*qtd;
    this.dadosItem.vrTotal  = vrTotal; 
  }

  salvar()
  {
    this.design.presentLoading('Gravando...')
    .then(resLoading=>{
      resLoading.present(); 

      this.srvComercial.updateItem(this.pedidoUid,this.dadosItem["id"],this.dadosItem)
      .then(res=>{
        console.log('Dados o item salvos com sucesso.')
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Falha ao atualizar valores',
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
