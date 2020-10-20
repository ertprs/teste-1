import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { NavParams, ModalController } from '@ionic/angular';
import { Contatos } from 'src/app/interface/chat/contatos';
import { Subscription } from 'rxjs';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ListaTransmissaoService } from 'src/app/services/atendimento/lista-transmissao.service';

@Component({
  selector: 'app-add-transmissao',
  templateUrl: './add-transmissao.page.html',
  styleUrls: ['./add-transmissao.page.scss'],
})
export class AddTransmissaoPage implements OnInit {

  private transmissaoId : string = null;
  private currentUser : string = '';
  private dadosTransmissao = {
    nome: 'teste',
    mensagem: 'teste teste'
  };

  private contatosSubscription: Subscription;

  public contatos = new Array<Contatos>();
  public filtered:any[] = [];
  public queryText : string = '';

  public selectedContacts = new Array();
  public selectedFilter : any[] = []; //Vetor secundário para armazenar contatos selecionados para encaminhar
  

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private nav:NavParams,
    public modal:ModalController,
    private contatosService : ContatosService,
    private listaTranmissaoService : ListaTransmissaoService
  ) { }

  ngOnInit() {
    const recover = this.nav.get('transmissaoId');
    this.transmissaoId = recover.transmissaoId;

    this.contatosSubscription = this.contatosService.getAll().subscribe(data=>{
    
      this.contatos = data;
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
    });
  }

  ngOnDestroy(){
    this.contatosSubscription.unsubscribe();
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

  contatoSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.contatos; 
      this.filtered = this.filtered.sort(function (a, b){
        return a-b
      })// Original array with food elements can be [] also
    }
    else{
      const filter = this.queryText.toUpperCase();

      this.filtered = this.contatos.filter((contato) => {
        for (let i = 0; i < contato.nome.length; i++) {
          let contatoNome = contato.nome;
          let contatoEmpresa = contato.nomeClienteVinculado || '';
          let contatoOrigem = contato.origem;
          contatoOrigem = contatoOrigem + "";
        
          if (contatoNome.toUpperCase().indexOf(filter) > -1 || contatoEmpresa.toUpperCase().indexOf(filter) > -1 || contatoOrigem.indexOf(filter) > -1) {
            return contato.nome;
          }
        }
      })
    }
  }

  contactsToForward(event : any, dados:Contatos){
    this.selectedFilter = [];

    let isChecked = event.currentTarget.checked;
    
    if (isChecked) {
      let achou = false;
      
      this.selectedContacts.forEach(item => {

        if(item.contato.origem == dados.origem)
        {
          achou = true;
        }
      });

      if (!achou) {
        const encaminhar = {
          transmissaoId: this.transmissaoId,
          contato:dados,
        }
        
        this.selectedContacts.push(encaminhar);
      }
    
    }
    else 
    {
      let achou = false;
      
      this.selectedContacts.forEach(item => {
        if(item.contato.origem == dados.origem)
        {
          achou = true;
        }
        else {
          this.selectedFilter.push(item);
        }
      });

      this.selectedContacts = this.selectedFilter;
    }
  }

  startTransmissao(){
    const transmissao = {
      createAt: 1343456,
      nome: 'transmissaoteste',
      mensagem: 'hello world',
      arquivo: 'teste',
    }

    const lista  = {
      nome: this.dadosTransmissao.nome,
      listaUid: 'ssssss',
      createAt: new Date().getTime(),
      favorito: false,
      situacao: 2,
      canal: 'lista',
      photo: '#fbba54',
      usuarioUid: this.currentUser,
      contatosVinculados: this.selectedContacts,
    };


    this.selectedContacts.forEach(contato => {
      // this.listaTranmissaoService.add(transmissao, lista);
      console.log(lista);

    });
  }


  generateColor(){

  }

  previousModal(){
    this.modal.dismiss();
  }

  closeModal(){
    this.modal.dismiss();
  }
}
