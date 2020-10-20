import { ProcessosService } from 'src/app/services/design/processos.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContatosService } from 'src/app/services/chat/contatos.service';

@Component({
  selector: 'app-modalgruposelecionar',
  templateUrl: './modalgruposelecionar.page.html',
  styleUrls: ['./modalgruposelecionar.page.scss'],
})
export class ModalgruposelecionarPage implements OnInit {
  public listaGrupos = []
  public dadosFiltro = {grupo:''}
  @Input() dados: string;
  public itens = []

  constructor(
    private ctrlModal:ModalController,
    private srvContato:ContatosService,
    private design:ProcessosService
  ) { }

  ngOnInit() {
    if(this.dados)
    {
      let dadosItens = <any>this.dados;
      console.log(1)
      console.log(dadosItens)
      console.log(2)
      dadosItens.forEach(dadosRet=>{
        const data = dadosRet;
        let processo = 1;
        const itemAdd = {processo,...data}
        console.log(itemAdd)
        this.itens.push(itemAdd)
      })
    }
  }
  closeModal(){
    this.ctrlModal.dismiss();
  }
  async confirmTroca(){

   if(this.dadosFiltro.grupo.trim() == '')
   {
      this.design.presentToast(
        'Selecione o grupo antes de confirmar',
        'secondary',
        0,
        true
      )
   }
   else
   {
    this.itens.forEach(async elem=>{
      elem.processo = 2;
      
      await this.srvContato.atualizarGrupos(elem.id,this.dadosFiltro.grupo)
      .then(res=>{
        elem.processo = 3;
      })
      .catch(err=>{
        console.log(err)
        elem.processo = 4;
      })
 
 
    })
   }
   
  
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
        }
      })
    })
  }
}
