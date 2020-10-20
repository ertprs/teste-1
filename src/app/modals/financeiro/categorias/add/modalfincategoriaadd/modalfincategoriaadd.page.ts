import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { CategoriasService } from 'src/app/services/financeiro/configuracoes/categorias.service';

@Component({
  selector: 'app-modalfincategoriaadd',
  templateUrl: './modalfincategoriaadd.page.html',
  styleUrls: ['./modalfincategoriaadd.page.scss'],
})
export class ModalfincategoriaaddPage implements OnInit {

  private dadosCategoria = { 
    nome:'',
    dre:'',
    dreNome:''
  }
  constructor(
    private srvCategoria:CategoriasService,
    private design:ProcessosService,
    private ctrlModal:ModalController
  ) { }

  close()
  {
    this.ctrlModal.dismiss()
  }
  gravar()
  {
    this.design.presentAlertConfirm(
      'Confirmar',
      'Confirma cadastrar esta categoria?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Inserindo ...')
        .then(resLoading=>{
          resLoading.present()
          let preDRE = this.dadosCategoria.dre.split('|')
          this.dadosCategoria.dre = preDRE[0]
          this.dadosCategoria.dreNome = preDRE[1]

          this.srvCategoria.categoriaAdd(this.dadosCategoria)
          .then(resAdd=>{
            this.design.presentToast(
              'Cadastrado com sucesso',
              'success',
              3000
            )
            this.close()
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao incluir categoria',
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

  ngOnInit() {
  }

}
