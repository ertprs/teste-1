import { inject } from '@angular/core/testing';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contatos } from 'src/app/interface/chat/contatos';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ModalController, Platform } from '@ionic/angular';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ListaTransmissaoService } from 'src/app/services/atendimento/lista-transmissao.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { GruposService } from 'src/app/services/chat/grupos.service';
import { Grupos } from 'src/app/interface/chat/grupos';
import { FiltrosPesquisaTransmissaoPage } from 'src/app/modals/lista-transmissao/filtros-pesquisa-transmissao/filtros-pesquisa-transmissao.page';

@Component({
  selector: 'app-comp-lista-add',
  templateUrl: './comp-lista-add.component.html',
  styleUrls: ['./comp-lista-add.component.scss'],
})
export class CompListaAddComponent implements OnInit {

  @Input() data: any;
  private transmissaoId : string = null;
  private currentUser : string = '';
  public dadosTransmissao: Contatos = {};

  private contatosSubscription: Subscription;
  private gruposSubscription: Subscription;
  private listaSubscription : Subscription;
  private checkboxSize : number = 1;

  public contatos = new Array<Contatos>();
  public grupos = new Array<Grupos>();
  public filtered : any[] = [];
  public queryText : string = '';

  public selectedFilter : any[] = []; //Vetor secundário para armazenar contatos selecionados para encaminhar

  public showSelecteds : boolean = false;
  public selectedsIcon : string = 'chevron-down-outline';
  

  public selectedContacts = new Array();
  //VARIAVEIS LEANDRO
  public contatosSelecionados : any[] = [];

  private chipColors = [
    {canal: 'todos', color: 'secondary'},
    {canal: 'selecionados', color: 'primary'},
    {canal: 'whatsapp', color: 'primary'},
    {canal: 'telegram', color: 'primary'},
  ];

  //FILTER PARAMS
  private grupoParam : string = '';
  private subGrupoParam : string = '';
  private cidadeParam : string = '';
  private estadoParam : string = '';

  //FILTER VALUES
  private cidades : any[] = [];
  private estados : any[] = [];



  public fastFiltro:boolean = false;

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    public modal:ModalController,
    private contatosService : ContatosService,
    private gruposService : GruposService,
    private listaTranmissaoService : ListaTransmissaoService,
    private designProccess : ProcessosService,
    private platform : Platform
  ) { }


  

  ngOnInit() {

    console.log(this.data);

    this.transmissaoId = this.data.id;

    



    if (this.transmissaoId){
      this.fastFiltro = true;
      this.listaSubscription = this.contatosService.get(this.transmissaoId).subscribe(data => {
        this.listaSubscription.unsubscribe();

        this.dadosTransmissao = data;
        data["contatosVinculados"].forEach(element => {
          let dadosAdd = {selecionado:true, ... element}

          this.contatosSelecionados.push(dadosAdd);
        });
      setTimeout(() => {
        this.preencherCadastroContatos();
      }, 200);


      });

      
    }
    else
    {
      this.preencherCadastroContatos();
  
    
    }

  }
  
  preencherCadastroContatos()
  {
    this.contatosSubscription = this.contatosService.getAll().subscribe(data=>{
      this.contatosSubscription.unsubscribe();
      const dadosContato = [];
      this.cidades = [];

      data.forEach(elem=>{

        
        

        let selecionado = false

        let checkContato = this.contatosSelecionados.reduce( function( cur, val, index ){

            if( val.id === elem.id && cur === -1 ) {
                return index;
            }
            return cur;
        
        }, -1 );

        if(checkContato >-1)
        {
          //EXISTE
        
          selecionado = true;
        }
        
        dadosContato.push({selecionado, ... elem})
      });

      this.contatos = dadosContato;
      this.filtered = this.contatos;

      this.filtered = this.filtered.sort((n1,n2) => {
        if (n1.nome > n2.nome) {
            return 1;
        }
    
        if (n1.nome < n2.nome) {
            return -1;
        }
    
        return 0;
      });

      if(this.transmissaoId)
      {
        this.mostrarSelecionados()
      }

    });
  }
  ngOnDestroy(){
    //this.contatosSubscription.unsubscribe();
    //this.gruposSubscription.unsubscribe();
  }
  mostrarSelecionados()
  {
    console.log(this.contatosSelecionados);
    this.filtered = this.contatosSelecionados;
  }
  functionExecute(functionName:string,params:any)
  {

  
    const param = {
      function:functionName,
      data:params
    }
    
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  contatoSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {

      if(!this.fastFiltro)
      {
        this.filtered = this.contatos; 
      }
      else
      {
        this.filtered = this.contatosSelecionados; 
      }
      

      this.filtered = this.filtered.sort(function (a, b){
        return a-b
      })// Original array with food elements can be [] also
    }
    else{
      const filter = this.queryText.toUpperCase();

      const dadosFiltrar = this.contatos;

      if(this.fastFiltro)
      {
       
        this.filtered = this.contatosSelecionados; 
      }

      this.filtered = dadosFiltrar.filter((contato) => {
        for (let i = 0; i < contato.nome.length; i++) {
          let contatoNome = contato.nome;
          let contatoEmpresa = contato.nomeClienteVinculado || '';
          let contatoOrigem = contato.origem;
          let contSelecionado = false;
          contatoOrigem = contatoOrigem + "";

          let checkConversa = this.contatosSelecionados.reduce( function( cur, val, index ){

            if( val.id === contato.id && cur === -1 ) {
                return index;
            }
            return cur;
        
          }, -1 );
          if(checkConversa>-1)
          {
            contato["selecionado"] = true;
          }

          


        
          if (contatoNome.toUpperCase().indexOf(filter) > -1 || contatoEmpresa.toUpperCase().indexOf(filter) > -1 || contatoOrigem.indexOf(filter) > -1) {
            return contato.nome;
          }
        }
      })
    }

  }
  fastFiltre(event:any)
  {
    const isChecked = event.target.checked;

    if (isChecked) {
      this.fastFiltro = true;
      this.designProccess.presentLoading('Preparando...')
      .then(resLoading=>{
        resLoading.present();
        this.filtered = this.contatosSelecionados
        resLoading.dismiss();
      })
      
    }
    else
    {
      this.fastFiltro = false;
      this.designProccess.presentLoading('Preparando...')
      .then(resLoading=>{
        resLoading.present();
        this.filtered = this.contatos;
        resLoading.dismiss();
      })
      
    }
  }
  contactsToForward(event : any, dados:Contatos){
    this.selectedFilter = [];
    
    const isChecked = event.target.checked;

    if (isChecked) {
      let checkConversa = this.contatosSelecionados.reduce(( cur, val, index ) => {

        if( val.id === dados.id && cur === -1 ) {
            return index;
        }
        return cur;
    
      }, -1 );
  
      if(checkConversa >-1)
      {
        //EXISTE JA COMO SELECIONADO
      }
      else
      {
        //NAO EXISTE NO SELECIONADO
        let dadosAdd = {selecionado:true, ... dados}
        this.contatosSelecionados.push(dadosAdd);
      }
    }
    else {
      let checkConversa = this.contatosSelecionados.reduce(( cur, val, index ) => {

        if( val.id === dados.id && cur === -1 ) {
            return index;
        }
        return cur;
    
      }, -1 );
  
      if(checkConversa >-1)
      {
       
        //EXISTE JA COMO SELECIONADO
        this.contatosSelecionados.splice(checkConversa, 1);
        this.filtered = this.contatosSelecionados
      
      }
      
    }

  }


  filterList(canal : string, params : string){
    const tempParam = params;
    const canalFilter = [];
    const tempArray = [];

    // this.grupoParam = '';
    // this.subGrupoParam = '';
    // this.cidadeParam = '';
    // this.estadoParam = '';

    this.chipColors.forEach(chip => {
      if (chip.canal == canal) {
        chip.color = 'secondary';
      }
      else {
        chip.color = 'primary';
      }
    });

    this.contatos.forEach(contato => {
      tempArray.push(contato);
    });

    switch (canal) {
      case 'todos':
        this.filtered = this.contatos;
        this.fastFiltro = false;
        break;
      case 'selecionados':
        this.filtered = this.contatosSelecionados;
        break;
      case 'whatsapp':
        tempArray.forEach(contato => {
          if (contato.canal == 'whatsappdirect' || contato.canal == "whatsapp") {
            canalFilter.push(contato);
          }
        });

        this.filtered = canalFilter;
        break;  
        case 'telegram':
      case 'telegram':
        tempArray.forEach(contato => {
          if (contato.canal == 'telegram') {
            canalFilter.push(contato);
          }
        });

        this.filtered = canalFilter;
        break; 
      case 'grupo':
        this.grupoParam = tempParam;

        tempArray.forEach(contato => {
          if (contato.grupo == tempParam) {
            canalFilter.push(contato);
          }
        });

        this.filtered = canalFilter;
        break;
      case 'subgrupo':
        this.subGrupoParam = tempParam;

        tempArray.forEach(contato => {
          if (contato.subgrupo == tempParam) {
            canalFilter.push(contato);
          }
        });

        this.filtered = canalFilter;
        break;
      case 'cidade':
        this.cidadeParam = tempParam;
        tempArray.forEach(contato => {
          if (contato.cidade == params) {
            canalFilter.push(contato);
          }
        });

        this.filtered = canalFilter;
        break;
        case 'estado':
          this.estadoParam = tempParam;
          tempArray.forEach(contato => {
            if (contato.estado == params) {
              canalFilter.push(contato);
            }
          });
  
          this.filtered = canalFilter;
          break;
      default:
        break;
    }
  }

  transmissaoAdd(){

    this.dadosTransmissao.canal = 'lista';
    this.dadosTransmissao["contatosVinculados"] = this.contatosSelecionados;
    this.dadosTransmissao.origem = new Date().getTime().toString();

   

    if (this.transmissaoId) {
      //ATUALIZAR DADOS
      if(this.contatosSelecionados.length > 0)
      {
        this.designProccess.presentLoading('Atualizando...')
        .then((resLoading)=>
        {
          console.log(this.dadosTransmissao);
          resLoading.present();
          this.contatosService.update(this.transmissaoId,this.dadosTransmissao)
          .then(()=>{
            this.designProccess.presentToast(
              'Alterado com sucesso',
              'success',
              3000
              );
          })
          .catch((err)=>{
            this.designProccess.presentToast(
              'Falha ao atualizar contato '+err,
              'danger',
              4000
            );
          })
          .finally(()=>{
            resLoading.dismiss();
            this.modal.dismiss();
          });
        })
        .catch(err=>{
          console.log(err)
          this.designProccess.presentToast(
            'Falha ao atualizar lista',
            'danger',
            0,
            true
          )
        })
        .finally(()=>{

        })
      }
      else
      {
        this.designProccess.presentToast(
          'Não existem contatos selecionados',
          'secondary',
          0,
          true
        )
      }


      

    }
    else
    {
      //ADICIONAR NOVO 

      if(this.contatosSelecionados.length > 0)
      {
        this.designProccess.presentLoading('Incluindo...')
        .then(resLoading=>{
          resLoading.present()
            //this.dadosContato.favorito = this.favorito_checkbox;
          this.contatosService.add(this.dadosTransmissao)
          .then((resRetorno)=>{
        
            this.transmissaoId = resRetorno
            this.designProccess.presentToast(
              'Cadastrado com sucesso!',
              'success',
              3000
            );
          
          })
          .catch((err)=>{
            console.log(err)
            if(err.code == 1)
            { 
              this.designProccess.presentToast(
                err.msg,
                'warning',
                0,
                true
              );
            }
            else
            { 
              this.designProccess.presentToast(
                'Falha ao cadastrar '+err,
                'danger',
                4000,
                true
              )
            }
          })
          .finally(()=>{
            resLoading.dismiss();
          })
          
        })
       
      }
      else
      {
        this.designProccess.presentToast(
          'Não existem contatos selecionados',
          'secondary',
          0,
          true
        )
      }

  
     
    }

  }

  async transmissaoDelete(){
    await this.designProccess.presentAlertConfirm(
      'Excluir!',
      'Posso excluir esta lista?',
      "Pode!",
      "Nem pensar..."
    )
    .then((resp)=>
    {
      
      if(resp)
      {
        //OK
        this.contatosService.delete(this.transmissaoId)
        .then(()=>{
          this.designProccess.presentToast(
            'Lista de Transmissão deletada com sucesso ',
            'success',
            3000
          );
          // this.modal.dismiss();
          // this.functionExecute('chatContatoHome',{});
        })
        .catch((err)=>{
          this.designProccess.presentToast(
            'Falha ao deletar lista de transmissão '+err,
            'success',
            3000
          );
        });
      }

    })
    .catch(()=>{

    })
  }

  showSelectedContacts(){    
    if (this.showSelecteds) {
      this.showSelecteds = false;
      this.selectedsIcon = 'chevron-down-outline';
      console.log(this.showSelecteds);
    }
    else {
      this.showSelecteds = true;
      this.selectedsIcon = 'chevron-up-outline';
      console.log(this.showSelecteds);
    }
  }

  generateColor(){

  }

  previousModal(){
    this.modal.dismiss();
  }

  closeModal(){
    this.modal.dismiss();
  }
  
  async listaTransmissaoFiltros() {
    const modal = await this.modal.create({
      component: FiltrosPesquisaTransmissaoPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
      componentProps: {
        contatos: this.contatos,
        contatosSelecionados: this.contatosSelecionados
      }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        this.filtered = data.data;
      }
    });

    await modal.present();
  }

}
