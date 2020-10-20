import { ProcessosService } from 'src/app/services/design/processos.service';
import { ComercialService } from 'src/app/services/comercial/comercial.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedidositens } from 'src/app/interface/comercial/pedidositens';
import { ModalfiscalicmssittributariaPage } from '../../fiscal/emissao/apoio/modalfiscalicmssittributaria/modalfiscalicmssittributaria.page';
import { ModalfiscalipisittributariaPage } from '../../fiscal/emissao/apoio/modalfiscalipisittributaria/modalfiscalipisittributaria.page';
import { ModalfiscalpissittributariaPage } from '../../fiscal/emissao/apoio/modalfiscalpissittributaria/modalfiscalpissittributaria.page';
import { ModalfiscalcfopPage } from '../../fiscal/emissao/apoio/modalfiscalcfop/modalfiscalcfop.page';

@Component({
  selector: 'app-peditemedit',
  templateUrl: './peditemedit.page.html',
  styleUrls: ['./peditemedit.page.scss'],
})
export class PeditemeditPage implements OnInit {


  
  @Input() itemUid:any;
  @Input() pedidoUid:string;

  public dadosSubscription: Subscription;
  private dadosItem = {
    uid:'',
    codigo:'',
    descricao:'',
    ncm:'',
    cest:'',
    vrUnitario:0,
    quantidade:0,
    unidadeMedida:"",
    vrTotal:0,
    cfop:'',
    cfopDescricao:'',
    impostos:{
      icms:{
        situacaoTributaria:"",
        situacaoTributariaNome:"",
        origem:"",
        aliquota:0,
        aliquotaST:0,
        percentualMargemValorAdicionadoST:0,
        modalidadeBaseCalculoST:0,
        baseCalculoST:0,
        valorST:0
      

      },
      ipi:{
        situacaoTributaria:"",
        situacaoTributariaNome:"",
        porAliquota:{
          aliquota:0
        }
      },
      pis: {
        situacaoTributaria: "",
        situacaoTributariaNome:"",
        porAliquota: {
          aliquota: 0
        }
      },
      cofins: {
        situacaoTributaria: "",
        situacaoTributariaNome:"",
        porAliquota: {
          aliquota: 0
        }
      }
    }

  };
  
  constructor(
    private ctrlModel:ModalController,
    private srvComercial:ComercialService,
    private design:ProcessosService
  ) { }
  closeModel(){
  
    this.ctrlModel.dismiss();
  }
  ngOnInit() {

    this.srvComercial.PedidosItensGetUnitario(this.pedidoUid,this.itemUid).subscribe(element=>{
      if(element.exists)
      {
        const data = <any>element.data()
  
        this.dadosItem = data
        console.log(data)
      }
    })
   
  }
  async abrirSitTributariaICMS(){
    const modal = await this.ctrlModel.create({
      component: ModalfiscalicmssittributariaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModel.getTop(), // Get the top-most ion-modal
      
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        const dataReturn = data.data
        const nome = dataReturn.codigo+" - "+dataReturn.nome
        console.log(nome)
        this.dadosItem.impostos.icms.situacaoTributariaNome = nome
        this.dadosItem.impostos.icms.situacaoTributaria =  dataReturn.codigo
      }
    });

    await modal.present();
  }

  calcularBaseSt()
  {
    let totalOperacao1 = Number(this.dadosItem.vrUnitario)*Number(this.dadosItem.quantidade)
    let totalOperacao = parseFloat(totalOperacao1.toFixed(2))
    console.log('Total OP '+totalOperacao)
    let mva1 = 1+((Number(this.dadosItem.impostos.icms.percentualMargemValorAdicionadoST)/100))
    let mva = parseFloat(mva1.toFixed(4))
    console.log('MVA '+mva)
    let baseIcmsSt1 = totalOperacao*mva
    let baseIcmsSt = parseFloat(baseIcmsSt1.toFixed(2))


    let icmsDaNota = (totalOperacao/100)*Number(this.dadosItem.impostos.icms.aliquotaST)

    let baseIcmsSt2 = (baseIcmsSt1/100)*Number(this.dadosItem.impostos.icms.aliquotaST)
    
    let baseIcmsSt3 = parseFloat(baseIcmsSt2.toFixed(2))



    let valorST = icmsDaNota-baseIcmsSt3
    if(valorST < 0)
    {
      valorST = valorST*(-1)
    }
    console.log('Calculo ST 3'+baseIcmsSt3)
    this.dadosItem.impostos.icms.baseCalculoST = baseIcmsSt3
    this.dadosItem.impostos.icms.valorST = parseFloat(valorST.toFixed(2))

    console.log("Total ST "+this.dadosItem.impostos.icms.valorST)

  }


  async abrirSitTributariaIPI(){
    const modal = await this.ctrlModel.create({
      component: ModalfiscalipisittributariaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModel.getTop(), // Get the top-most ion-modal
      
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        const dataReturn = data.data
        const nome = dataReturn.codigo+" - "+dataReturn.nome
        console.log(nome)
        this.dadosItem.impostos.ipi.situacaoTributariaNome = nome
        this.dadosItem.impostos.ipi.situacaoTributaria =  dataReturn.codigo
      }
    });

    await modal.present();
  }

  async abrirSitTributariaPisCofins(origem:string){
    const modal = await this.ctrlModel.create({
      component: ModalfiscalpissittributariaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModel.getTop(), // Get the top-most ion-modal
      
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        const dataReturn = data.data
        const nome = dataReturn.codigo+" - "+dataReturn.nome
        if(origem === "pis")
        {
          this.dadosItem.impostos.pis.situacaoTributariaNome = nome
          this.dadosItem.impostos.pis.situacaoTributaria =  dataReturn.codigo  
        }
        if(origem === "cofins")
        {
          this.dadosItem.impostos.cofins.situacaoTributariaNome = nome
          this.dadosItem.impostos.cofins.situacaoTributaria =  dataReturn.codigo  
        }
        
      }
    });

    await modal.present();
  }

  async abrirCFOP(){
    const modal = await this.ctrlModel.create({
      component: ModalfiscalcfopPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModel.getTop(), // Get the top-most ion-modal
      
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        const dataReturn = data.data
        const nome = dataReturn.codigo+" - "+dataReturn.nome
        
        this.dadosItem.cfopDescricao = nome
        this.dadosItem.cfop =  dataReturn.cfop  
       
        
      }
    });

    await modal.present();
  }


  limparCampo(event:any,apenas:any)
  {
    
    if(apenas === 'number')
    {
      //event.target.value = event.target.value.replace(/[^0-9]*/g, '');
      //event.target.value =  event.target.value.replace(/[-][\d]*[.]{0,2}[\d]+/g, '');
      event.target.value = event.target.value.replace(/[^0-9]*[,]/g, '');
    }
  }
  salvar()
  {
    this.design.presentAlertConfirm(
      'Gravar?',
      'Confirma gravar informações?',
      'SIM',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Gravando...')
        .then(resLoading=>{
          resLoading.present()
          console.log(this.dadosItem)
          this.srvComercial.PedidosItensAtualizar(this.pedidoUid,this.itemUid,this.dadosItem)
          .then(resAtualizar=>{
            this.design.presentToast(
              'Informações salvas com sucesso',
              'success',
              3000
            )
          })
          .catch(errAtualizar=>{
            console.log(errAtualizar)
            this.design.presentToast(
              'Falha ao atualziar item',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoading.dismiss()
          })
        })
        
        
      }
    })
  }

}
