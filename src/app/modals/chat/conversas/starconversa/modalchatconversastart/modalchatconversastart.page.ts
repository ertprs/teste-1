import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServAtendimentoService } from 'src/app/services/atendimento/serv-atendimento.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-modalchatconversastart',
  templateUrl: './modalchatconversastart.page.html',
  styleUrls: ['./modalchatconversastart.page.scss'],
})
export class ModalchatconversastartPage implements OnInit {


  private formarFrase:boolean = false;
  private itemsTemplates = []
  private itemsFrase = []

  constructor(
    private srvTemplate:ServAtendimentoService,
    private ctrlModal:ModalController,
    private design:ProcessosService
  ) { }
  closeModal()
  {
    this.ctrlModal.dismiss()
  }
  ngOnInit() {


    this.formarFrase = false;
    this.srvTemplate.wppTemplateGetAll().then(resDados=>{
      resDados.subscribe(dados=>{
        console.log(dados)
        this.itemsTemplates = dados
      })
     
      
    })
  }
  cancelarFrase()
  {
    this.formarFrase = false;
  }
  iniciarConversa()
  {
    let fraseStart = "Oi Leandro como posso ajudar você?  "
    const dadosReturn ={
      frase:fraseStart
    }
    this.ctrlModal.dismiss(dadosReturn)
  }
  selecionarFrase(dados:any)
  {
    if(dados.aprovado)
    {
      this.formarFrase = true;
      this.itemsFrase = []
      console.log(dados)
      let campoNumero = 1
      for (let i = 0; i < dados.campos ; i++) {
        
        this.itemsFrase.push({
          nome:'Campo '+i,
          id:i
        })
        campoNumero++
      }
      

    }
    else
    {
      this.design.presentToast(
        'Template não aprovada para uso',
        'warning',
        0,
        true
      )
    }

  }

}
