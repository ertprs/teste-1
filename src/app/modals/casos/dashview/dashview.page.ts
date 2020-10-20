import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServAtendimentoService } from 'src/app/services/atendimento/serv-atendimento.service';

@Component({
  selector: 'app-dashview',
  templateUrl: './dashview.page.html',
  styleUrls: ['./dashview.page.scss'],
})
export class DashviewPage implements OnInit {


  private items = []
  @Input() tipo: string;
  constructor(
    private ctrlModal:ModalController,
    private servAtendimentoService:ServAtendimentoService,
  ) { }




  ngOnInit() {

    

    if(this.tipo == 'novo')
    {
      this.servAtendimentoService.casoGetDashNovos().subscribe(elem=>{
      
        elem.docs.sort(function(a:any,b:any) {
          return a.createAt < b.createAt ? -1 : a.createAt > b.createAt ? 1 : 0;
        }).forEach(dados=>{
          const addRegistro = {
            id:dados.id,
            ... dados.data()
          }
          
          this.items.push(addRegistro)
        })
        
        
      })
    }
    else if (this.tipo === 'semresposta')
    {
      this.servAtendimentoService.casoGetDashSemAtendimento().subscribe(elem=>{
      
        elem.docs.sort(function(a:any,b:any) {
          return a.createAt < b.createAt ? -1 : a.createAt > b.createAt ? 1 : 0;
        }).forEach(dados=>{
          const addRegistro = {
            id:dados.id,
            ... dados.data()
          }
          
          this.items.push(addRegistro)
        })
        
        
      })
    }
    else if(this.tipo === 'emandamento')
    {
      this.servAtendimentoService.casoGetDashEmAtendimento().subscribe(elem=>{
      
        elem.docs.sort(function(a:any,b:any) {
          return a.createAt < b.createAt ? -1 : a.createAt > b.createAt ? 1 : 0;
        }).forEach(dados=>{
          const addRegistro = {
            id:dados.id,
            ... dados.data()
          }
          
          this.items.push(addRegistro)
        })
        
        
      })
    }
    else
    {
      alert('Falha ao carregar tipo de dados '+this.tipo)
    }
    
  }

  closeModal(){
    this.ctrlModal.dismiss()
  }
  abrirTicket(id:string)
  {
    this.ctrlModal.dismiss({
      acao:'open',
      id
    })
  }

}



