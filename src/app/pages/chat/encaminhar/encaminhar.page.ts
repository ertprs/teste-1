import { Mensagens } from 'src/app/interface/chat/mensagens';
import { Component, OnInit, Input } from '@angular/core';
import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ComercialService } from 'src/app/services/comercial/comercial.service';
import { NavController, ModalController } from '@ionic/angular';
import { Contatos } from 'src/app/interface/chat/contatos';
import { Subscription } from 'rxjs';
import { Pedidos } from 'src/app/interface/comercial/pedidos';
import { Conversas } from 'src/app/interface/chat/conversas';
import { Itencaminharmensagem } from 'src/app/interface/chat/itencaminharmensagem';

@Component({
  selector: 'app-encaminhar',
  templateUrl: './encaminhar.page.html',
  styleUrls: ['./encaminhar.page.scss'],
})
export class EncaminharPage implements OnInit {


  @Input() mensagensParaEncaminhar: any;
  private conversasSubscription: Subscription;

  private pedidoUid: string = null;
  public dadosPedido: Pedidos = {};
  public queryText : string = ''; 
  private forwardMessages : any[] = [];
  private filtered : any[] = []; //Vetor secundário para armazenar filtro atual da pesquisa

  public contatos = new Array<Contatos>();
  public conversas = new Array<Conversas>();



  public mensagemEncaminhar : Itencaminharmensagem ={};

  public forwardContacts = new Array();
  public forwardFilter : any[] = []; //Vetor secundário para armazenar contatos selecionados para encaminhar
  public sendResult : any[] = [];
  public selectedContacts : boolean = true; //Validador para verificar se há 1 contato selecionado para permitir encaminhamento

  public contatosSelecionados : any[] = [];


  constructor(
    private mensagensService: MensagensService,
    private contatoService:ContatosService,
    private design:ProcessosService,
    private router:Router,
    private conversasService:ConversasService,
    private afa:AngularFireAuth,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private navCtrl:NavController
    ) 
    { 
     
    }

  ngOnInit() {
    
    console.log('LIstando como esta a conversa')
    console.log(this.mensagensParaEncaminhar)
  

    this.loadConversas();
    
  }

  ngOnDestroy(){
    this.conversasSubscription.unsubscribe();
  }

  //Carregar conversas ativas do usuário para encaminhar
  async loadConversas(){
    this.conversasSubscription = this.conversasService.getAllUser().subscribe(conversas => {
      this.conversasSubscription.unsubscribe();
      this.filtered = conversas;
      

      

      // this.conversasSubscription.unsubscribe();
    });
  }

  // Filtrar contatos pela pesquisa
  contatoForwardSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.conversas;
    }
    else{
      const filter = this.queryText.toUpperCase();

      this.filtered = this.conversas.filter((conversa) => {
        for (let i = 0; i < conversa.contatoNome.length; i++) {
          let contatoNome = conversa.contatoNome || '';
          let contatoEmpresa = conversa.nomeClienteVinculado || '';
          let contatoOrigem = conversa.contatoOrigem || '';
          contatoOrigem = contatoOrigem + "";
        
          if (contatoNome.toUpperCase().indexOf(filter) > -1 || contatoEmpresa.toUpperCase().indexOf(filter) > -1 || contatoOrigem.indexOf(filter) > -1) {
            return conversa.contatoNome;
          }
        }
      })
    }
  }

  // Verificar se contato já foi selecionado para encaminhar
  ffff(event : any, dados:Conversas){
    this.forwardFilter = [];

    let isChecked = event.currentTarget.checked;
    
    if (isChecked) {
      let achou = false;
      
      this.forwardContacts.forEach(item => {

        if(item.contato.origem == dados.contatoOrigem)
        {
          achou = true;
        }
      });

      if (!achou) {
        const encaminhar = {
          contato:dados,
          mensagem:this.forwardMessages
        }
        
        this.forwardContacts.push(encaminhar);
      }
      
      console.log(this.forwardContacts.length);
      this.forwardContacts.length > 0 ? this.selectedContacts = false : this.selectedContacts = true;
      
    }
    else 
    {
      let achou = false;
      
      this.forwardContacts.forEach(item => {
        if(item.contato.origem == dados.contatoOrigem)
        {
          achou = true;
        }
        else {
          this.forwardFilter.push(item);
        }
      });

      this.forwardContacts = this.forwardFilter;

      console.log(this.forwardContacts.length);
      this.forwardContacts.length > 0 ? this.selectedContacts = false : this.selectedContacts = true;
    }
  }

  contactsToForward(event : any, dados:Contatos){

    
    //const isChecked = event.target.checked;
    console.log(dados)
    
    let checkContato = this.contatosSelecionados.reduce(( cur, val, index ) => {

      if( val.id === dados.id && cur === -1 ) {
          return index;
      }
      return cur;
  
    }, -1 );

    if(checkContato >-1)
    {
      //EXISTE JA COMO SELECIONADO
      console.log('Removendo contato '+dados.nome)
      this.contatosSelecionados.splice(checkContato,1)
    }
    else
    {
      //NAO EXISTE NO SELECIONADO
      console.log('Adicionando contato '+dados.nome)
      this.contatosSelecionados.push(dados);
    }
    
   

  
  }

  async sendForwardedMessages(){
    this.sendResult = [];

    await this.design.presentLoading('Encaminhando mensagens...').then(async res=>{ 
      try {
        res.present();

        this.contatosSelecionados.forEach(elem => {
          let dadosContato = elem.contato;

          this.mensagensParaEncaminhar.forEach(elemMensagem=>{
   
            this.mensagemEncaminhar.contatoUid  = elem.contatoUid,
            this.mensagemEncaminhar.contatoUidOrigem = elemMensagem.contatoUid
            this.mensagemEncaminhar.mensagemUid = elemMensagem.uid,
            this.mensagemEncaminhar.usuarioNome = this.afa.auth.currentUser.displayName, 
            this.mensagemEncaminhar.usuarioUid  = this.afa.auth.currentUser.uid, 
            this.mensagemEncaminhar.conversaUid =  elemMensagem.conversaUid
            
            
            console.log(this.mensagemEncaminhar);

            this.mensagensService.SendEncaminhar(this.mensagemEncaminhar).then((res) => {
              console.log('>'+res.id);
            });
          });
        });

        this.design.presentToast(
          'Mensagens encaminhadas com sucesso',
          'success',
          2000
        );

        this.modalController.dismiss('enviado');
      }
      catch(err)
      {
        console.log(err);
      }
      finally{
        res.dismiss();
      }

    })
    .catch((err)=>{
      
      console.log('[Err]'+ err);
      this.design.presentToast(
        'Falha ao encaminhar mensagens',
        'danger',
        3000
      )
      this.ngOnDestroy();
      this.router.navigate(['empresaselect'])
    })

  }

  closeModal() {
    console.log('Close modal')
      this.modalController.dismiss();
  }
}
