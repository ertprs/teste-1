import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modalcontatofiltros',
  templateUrl: './modalcontatofiltros.page.html',
  styleUrls: ['./modalcontatofiltros.page.scss'],
})
export class ModalcontatofiltrosPage implements OnInit {
  public listaGrupos = []
  public dadosFiltro = {grupo:'',dataIni:'',dataFim:'' }
  constructor(
    private ctrlModal:ModalController,
    private srvContato:ContatosService
  ) { }

  ngOnInit() {
    
  }
  closeModal(){
    this.ctrlModal.dismiss();
  }
  gerarFiltro(){

    const dados = {
      acao:'filtro',
      data:this.dadosFiltro
    }
  
    this.ctrlModal.dismiss(dados);
  }
  ngAfterViewInit(){
    this.srvContato.Select()
    .then(resProc=>{
      resProc.get().forEach(resDados=>{
        if(!resDados.empty)
        {
          resDados.forEach(dados=>{
            const data = dados.data();
            let checkGroup = this.listaGrupos.reduce(( cur, val, index ) => {

              if( val.grupo === data.grupo  && cur === -1 ) {
                  
                return index;
              }
              return cur;
          
            }, -1 );
            if(checkGroup == -1)
            {
              this.listaGrupos.push(data)
            }


          })

          this.listaGrupos.sort((n1,n2)=>{ 
            if (n1.grupo > n2.grupo) {
                return 1;
            }
        
            if (n1.grupo < n2.grupo) {
                return -1;
            }
        
            return 0;
           })
        }
      })
    })
  }
}

