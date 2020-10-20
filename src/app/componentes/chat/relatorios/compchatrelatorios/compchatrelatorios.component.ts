import { ModalchatrelatoriocadastrosultimosPage } from './../../../../modals/chat/relatorios/modalchatrelatoriocadastrosultimos/modalchatrelatoriocadastrosultimos.page';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ModalController } from '@ionic/angular';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { FiltrosPesquisaTransmissaoPage } from 'src/app/modals/lista-transmissao/filtros-pesquisa-transmissao/filtros-pesquisa-transmissao.page';

@Component({
  selector: 'app-compchatrelatorios',
  templateUrl: './compchatrelatorios.component.html',
  styleUrls: ['./compchatrelatorios.component.scss'],
})
export class CompchatrelatoriosComponent implements OnInit {

  public transmissaoList = new Array();
  public contatosQtd:number;
  public contatoAniversariantes:number;
  public contatoAniversariantesItens = new Array();
  public contatosUltimos:number
  public contatosUltimosItems =  new Array()
  public contatoBloqueado:number
  public contatoBloqueadoItens = new Array()
  constructor(
    private eventEmitterService:ProvEmitterEventService,
    private srvContato:ContatosService,
    private ctrlModal:ModalController,
    private design:ProcessosService,
    
  ) { }

  ngOnInit() {}
  async ngAfterViewInit(){

    //Contatos cadastrados
    this.srvContato.contadorContatos()
    .then(res=>{
      this.contatosQtd = res;
    })
    .catch(err=>{
      console.log(err)
      this.design.presentToast(
        'Houve um problema ao carregar dados importantes da tela',
        'warning',
        2000
      )
    })


    //CONTATOS ANIVERSARIANTES
    this.srvContato.contadorAniversariantes()
    .then(res=>{
      
      this.contatoAniversariantes = res.qtd
      this.contatoAniversariantesItens = res.data;
    })
    .catch(err=>{
      console.log(err)
      this.design.presentToast(
        'Houve um problema ao carregar dados importantes da tela (2)',
        'warning',
        2000
      )
    })

    //ULTIMOS CADAStrOS
    this.srvContato.contadorUltimos()
    .then(res=>{

      this.contatosUltimos = res.qtd;
      this.contatosUltimosItems = res.data;
 
    })
    .catch(err=>{
      console.log(err)
      this.design.presentToast(
        'Houve um problema ao carregar dados importantes da tela (3)',
        'warning',
        2000
      )
    })


    //CONTATOS BLOQUEADOS
    this.srvContato.contadorBloqueado()
    .then(res=>{

      this.contatoBloqueado = res.qtd;
      this.contatoBloqueadoItens = res.data;
 
    })
    .catch(err=>{
      console.log(err)
      this.design.presentToast(
        'Houve um problema ao carregar dados importantes da tela (3)',
        'warning',
        2000
      )
    })

    this.srvContato.GetListasTransmissao().forEach(dados=>{
      if(!dados.empty)
      {
        dados.docs.forEach(elem=>{
          const data = elem.data()
          const id = elem.id;
          const retorno = {id,... data}
          this.transmissaoList.push(retorno)
        })
      }
      else
      {
        this.transmissaoList = []
      }
    })
  }

  functionExecute(functionName:string,params:any)
  {
    const param = {
      function:functionName,
      data:params
    };
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  editar(item:any)
  {
    alert('Editar lista')
  }

  async criarLista(){
    const modal = await this.ctrlModal.create({
      component: FiltrosPesquisaTransmissaoPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        item:this.contatosUltimosItems
      }
    });

    await modal.present();
  }


  async modalDetalhe(titulo:string,itens:any) {
    const modal = await this.ctrlModal.create({
      component: ModalchatrelatoriocadastrosultimosPage,
      cssClass: 'selector-modal',
      componentProps: {
        titulo,
        itens
      }
    });
    return await modal.present();
  }

}
