import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiscalService } from 'src/app/service/fiscal/fiscal.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ModalfiscalncmaddPage } from '../add/modalfiscalncmadd/modalfiscalncmadd.page';

@Component({
  selector: 'app-modalfiscalncmgerenciar',
  templateUrl: './modalfiscalncmgerenciar.page.html',
  styleUrls: ['./modalfiscalncmgerenciar.page.scss'],
})
export class ModalfiscalncmgerenciarPage implements OnInit {

  private ncmList = []
  constructor(
    private ctrlModal:ModalController,
    private srvFiscal:FiscalService,
    private design:ProcessosService
  ) { }

  ngOnInit() {
    this.listarNcms()
  }
  closeModel(){
    this.ctrlModal.dismiss()
  }
  deletar(ncmUid:string)
  {
    this.design.presentAlertConfirm(
      'Excluir',
      'Confirma excluir dados da NCM',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Excluindo...')
        .then(resLoading=>{
          resLoading.present()
          this.srvFiscal.ncmDelete(ncmUid)
          .then(resDelete=>{
            this.listarNcms()
            this.design.presentToast(
              'Excluido com sucesso',
              'success',
              3000
            )
          })
          .catch(errDelete=>{
            console.log(errDelete)
            this.design.presentToast(
              'Falha ao excluir NCM',
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
  listarNcms()
  {
    this.srvFiscal.ncmGetAll().subscribe(elemNcm=>{
      this.ncmList = []
      
      if(!elemNcm.empty)
      {
        
        elemNcm.docs.forEach(dataNcm=>{
          if(dataNcm.exists)
          {
            const data = dataNcm.data()
            const id = dataNcm.id
            const dadosNcm={
              id,
              ... data
            }
            console.log(dadosNcm)
            this.ncmList.push(dadosNcm)
          }
        })
      }
    })
  }
  async selecionar(dados:any)
  {
    this.ctrlModal.dismiss({ncm:dados.ncm})
  }
  async abrir(ncmUid:string)
  {
    const modal2 = await this.ctrlModal.create({
      component: ModalfiscalncmaddPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        ncmUid
      }
    });

    modal2.onDidDismiss().then((data) => {
    
      this.listarNcms()
      console.log(data);
      if(data.data !== undefined) {
        if(data.data.link !== undefined) {
          console.log(data.data.link) 
        }
      }
    });

    await modal2.present();
  }
  async novo(){
    const modal = await this.ctrlModal.create({
      component: ModalfiscalncmaddPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        
      }
    });

    modal.onDidDismiss().then((data) => {
      this.listarNcms()
      console.log(data);
      if(data.data !== undefined) {
        if(data.data.link !== undefined) {
          console.log(data.data.link) 
        }
      }
    });

    await modal.present();
  }

}
