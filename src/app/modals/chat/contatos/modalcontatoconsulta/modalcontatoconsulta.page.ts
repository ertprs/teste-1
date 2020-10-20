import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServAtendimentoService } from 'src/app/services/atendimento/serv-atendimento.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';

@Component({
  selector: 'app-modalcontatoconsulta',
  templateUrl: './modalcontatoconsulta.page.html',
  styleUrls: ['./modalcontatoconsulta.page.scss'],
})
export class ModalcontatoconsultaPage implements OnInit {
  
  @Input() origem:string


  private contatosList = []
  private loadingProccess:boolean = false;
  constructor(
    private ctrlModal:ModalController,
    private contatoService:ContatosService,
  ) { }

  ngOnInit() {
  }
  selecionar(dados:any){
    this.ctrlModal.dismiss({origem:this.origem,contatoUid:dados.uid,contatoNome:dados.nome,contatoEmail:dados.origem_email,parceiroUid:dados.parceiroUid,parceiroNome:dados.parceiroNome,})
  }
  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
  carregarContatos(valor?:string)
  {

    const params ={
      consultarPor:valor,
   

     
    }
    this.loadingProccess = true
    console.log('Consultar '+JSON.stringify(params))
    this.contatosList = []

    this.contatoService.contatosGet(params).forEach(dados=>{
      console.log(dados)
      if(dados.situacao == 'suc')
      {
        const data = dados.data[0]
        //console.log(JSON.stringify(element))
        if(data.length > 0)
        {
          data.forEach(dadosRetorno  => {
            const dadosItem = {
              color: this.getRandomColor(),
              ... dadosRetorno
            }

            this.loadingProccess = false
          
            this.contatosList.push(dadosItem)
            
          });
        }
        else
        {
          this.loadingProccess = false
          this.contatosList = []
        
        }
          
         
        
      }
      else
      {
        this.loadingProccess = false
        this.contatosList = []
       
      }

    })
  
    
  
  }
  closeModal(){
    this.ctrlModal.dismiss()
  }
}
