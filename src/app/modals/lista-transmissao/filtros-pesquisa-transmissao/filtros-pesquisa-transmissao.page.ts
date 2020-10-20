import { ProcessosService } from 'src/app/services/design/processos.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { Subscription } from 'rxjs';
import { Contatos } from 'src/app/interface/chat/contatos';
import { GruposService } from 'src/app/services/chat/grupos.service';
import { ApoioService } from 'src/app/services/apoio/apoio.service';

@Component({
  selector: 'app-filtros-pesquisa-transmissao',
  templateUrl: './filtros-pesquisa-transmissao.page.html',
  styleUrls: ['./filtros-pesquisa-transmissao.page.scss'],
})
export class FiltrosPesquisaTransmissaoPage implements OnInit {

  @Input() item: any;
  private contatosSubscription: Subscription;
  private gruposSubscription: Subscription;
  public contatos = new Array();
  public contatosSelecionados : any[] = [];
  private filtros = {
    cidades: [],
    estados: [],
    grupos: [],
  };

  private allParams : any = {
    nome: '',
    canal: 'todos',
    cidade: 'todos',
    estado: 'todos',
    grupo: 'todos',
    subgrupo: 'todos',
    data: ''
  };

  private estadosSubscription: Subscription;
  private cidadesSubscription: Subscription;

  private cidadeAll = [];
  
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private nav:NavParams,
    public modal:ModalController,
    private contatosService : ContatosService,
    private gruposService : GruposService,
    private design:ProcessosService,
    private apoioService:ApoioService
  ) { 
    this.contatos = this.nav.get('contatos');
    this.contatosSelecionados = this.nav.get('contatosSelecionados');
    this.estadosSubscription = new Subscription;
    this.cidadesSubscription = new Subscription;
  }

  ngOnInit() {

   

    this.filtros = {
      cidades: [],
      estados: [],
      grupos: [],
    };


    if(this.item)
    {
      this.allParams.canal = this.item.canalFiltro;
      this.allParams.nome = this.item.nome;
      this.allParams.cidade = this.item.cidade;
      this.allParams.estado = this.item.estado;
      this.allParams.grupo = this.item.grupo;
      this.allParams.subgrupo = this.item.subgrupo
     
    }

    



  
      // this.filtros.cidades = [];
      // this.filtros.estados = [];

      // this.contatosService.getAllFull().subscribe(dados=>{
      //   this.contatos = dados;
      //   dados.forEach(elem=>{

      //     if(elem.estado !== undefined )
      //     {
      //       let checkCidade = this.filtros.estados.reduce( function( cur, val, index ){

      //           if( val === elem.estado && cur === -1 ) {
      //               return index;
      //           }
      //           return cur;
            
      //       }, -1 );
      //       if(checkCidade == -1)
      //       {
      //         if( elem.estado != '')
      //         {
      //           this.filtros.estados.push(elem.estado)
      //         }
             
      //       }
      //     }
          
      //     if(elem.cidade !== undefined )
      //     {
      //       let checkCidade = this.filtros.cidades.reduce( function( cur, val, index ){

      //           if( val === elem.cidade && cur === -1 ) {
      //               return index;
      //           }
      //           return cur;
            
      //       }, -1 );
      //       if(checkCidade == -1)
      //       {
      //         if( elem.cidade != '')
      //         {
      //           this.filtros.cidades.push(elem.cidade)
      //         }
             
      //       }
      //     }
          

      //   })

      // })



      
    this.estadosSubscription = this.apoioService.getEstados().subscribe(data => {
      this.filtros.estados = data;
      this.estadosSubscription.unsubscribe();
    });

    this.cidadesSubscription = this.gruposService.getCidades().subscribe(data => {
      this.cidadeAll = data;
      this.filtros.cidades = this.cidadeAll;
      this.cidadesSubscription.unsubscribe();
    });

    this.gruposSubscription = this.gruposService.getAll().subscribe(data => {
      this.filtros.grupos = data;
    });
  }

  functionExecute(functionName:string,params:any)
  {
    console.log(params);
    console.log('preparando '+functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  preLista(){

   
    if(this.allParams.canal !== '' && this.allParams.nome !== '')
    {
      this.allParams.canalFiltro = this.allParams.canal;
      this.allParams.canal = 'lista';
      this.allParams.origem = new Date().getTime().toString();
      this.allParams.contatosVinculados = {};
      console.log(this.allParams);

      this.design.presentLoading('Incluindo...').then(resLoading=>{
        resLoading.present()
        
        this.contatosService.add(this.allParams).then((resRetorno)=>{
      
          this.design.presentToast(
            'Cadastrado com sucesso!',
            'success',
            3000
          );
        
        }).catch((err)=>{
          console.log(err)
          if(err.code == 1) { 
            this.design.presentToast(
              err.msg,
              'warning',
              0,
              true
            );
          } else { 
            this.design.presentToast(
              'Falha ao cadastrar '+err,
              'danger',
              4000,
              true
            );
          }
        })
        .finally(()=>{
          resLoading.dismiss();
        })
      });
    }
    else
    {
      this.design.presentToast(
        'Verifique se informou o  nome da lista e o canal',
        'secondary',
        0,
        true
      )
    }
    
  }

  filterApply(){


    console.log(this.allParams)



    const arrFinal = [];
  

    for (const contato of this.contatos) {

      let validCanal = true;
      if( this.allParams.canal != 'todos') {
        if(contato.canal.toUpperCase() != this.allParams.canal.toUpperCase())  {
          validCanal = false;
        }
      }
      
      let validGrupo = true;
      if(this.allParams.grupo != 'todos') {
        if(contato.grupo === undefined)
        {
          validGrupo = false;
        }
        else{
          if(contato.grupo.toUpperCase() != this.allParams.grupo.toUpperCase())  {
            validGrupo = false;
          }
        }
        
      }
      let validSubgrupo = true;
      if(this.allParams.subgrupo != 'todos') {
        if(contato.subgrupo === undefined)
        {
          validSubgrupo = false;
        }
        else
        {
          if(contato.subgrupo.toUpperCase() != this.allParams.subgrupo.toUpperCase())  {
            validSubgrupo = false;
          }
        }
        
      }
      let validCidade = true;
      if(this.allParams.cidade != 'todos') {

        if(contato.cidade === undefined)
        {
          validCidade = false;
        }
        else
        {
          if( contato.cidade.toUpperCase() != this.allParams.cidade.toUpperCase())  {
            validCidade = false;
          }
        }


        
      }
      let validEstado = true;
      if(this.allParams.estado != 'todos') {
        if(contato.estado === undefined)
        {
          validEstado = false;
        }
        else
        {
          if(contato.estado.toUpperCase() != this.allParams.estado.toUpperCase())  {
            validEstado = false;
          }
        }
        
      }
      
      if(validCanal && validGrupo && validSubgrupo && validCidade && validEstado) {
        arrFinal.push(contato);
      }
    }
    if(arrFinal.length > 0 )
    {
      this.modal.dismiss(arrFinal);
      console.log(arrFinal);
    }
    else
    { 
      this.design.presentToast(
        'Não exite resultado para exibir',
        'secondary',
        0,
        true
      )
    }
    
  }

  closeModal(){
    this.modal.dismiss();
  }

  estadoChange(event) {
    if(this.allParams.estado === '0' || this.allParams.estado.toUpperCase() === 'TODOS') {

      this.filtros.cidades = this.cidadeAll;

    } else {

      this.filtros.cidades = this.cidadeAll.filter(elem => elem.uf === this.allParams.estado);

    }
  }
}
