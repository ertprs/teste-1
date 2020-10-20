import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoriasService } from 'src/app/services/financeiro/configuracoes/categorias.service';

@Component({
  selector: 'app-modalfincategoriaconsulta',
  templateUrl: './modalfincategoriaconsulta.page.html',
  styleUrls: ['./modalfincategoriaconsulta.page.scss'],
})
export class ModalfincategoriaconsultaPage implements OnInit {

  private categoriaItems:any = []
  private loading:boolean
  constructor(
    private ctrlModal:ModalController,
    private srvCategorias:CategoriasService
  ) { }

  ngOnInit() {
    this.listarCategorias()
  }
  listarCategorias(){
    this.loading = true
    this.srvCategorias.categoriaGetAll().forEach(element=>{
      this.loading = false
      if(!element.empty)
      {
        element.docs.forEach(dadosElement=>{
          const id = dadosElement.id
          const data = dadosElement.data()
          const dados = {
            id,
            ... data
          }
          this.categoriaItems.push(dados)
        })
      }
     
    })
  }
  closeModal(){
    this.ctrlModal.dismiss()
  }
  selecionar(item:any)
  {
    this.ctrlModal.dismiss({uid:item.id,nome:item.nome,dreNome:item.dreNome,dre:item.dre})
  }
}
