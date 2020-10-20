import { ConversasService } from 'src/app/services/chat/conversas.service';
import { Component, OnInit, Input } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Subscription } from 'rxjs';
import { Contatos } from 'src/app/interface/chat/contatos';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController, NavController } from '@ionic/angular';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';
import { Itaddparceiro } from 'src/app/interface/parceiros/add/itaddparceiro';
import * as estadosData from 'src/app/componentes/chat/contatos/add/estados-cidades.json';
import { GruposService } from 'src/app/services/chat/grupos.service';
import { Grupos } from 'src/app/interface/chat/grupos';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {

  @Input() data: any;
  public currentUser:any;
  public contatoId: string = null;
  public contatoSubscription: Subscription;
  public parceiroSubscription: Subscription;
  public gruposSubscription: Subscription;


  public parceirosItems = new Array<Itaddparceiro>();
  public grupos = new Array<Grupos>();
  public dadosContato: Contatos = {};
  public nomeOrigem = 'Telefone';
  public tipoOrigem = 'number';
  public typecampo:string = 'text';
  public origemInicial : string = '00000000000000';
  public placeholderOrigem = '55 (00) 0.0000-0000';
  public actualMask : string = '0000-0000 000 0000';
  public iconOrigem:string = 'call-outline';
  public canalNome : string = 'WhatsApp';

  private dataEstados : any = estadosData;
  public cidades : any[] = [];
  
  public favoritoIsChecked = false;
  public liveChatIsChecked = false;

  //Notification Checkboxes
  public administracaoIsChecked = false;
  public atendimentoIsChecked = false;
  public cadastroIsChecked = false;
  public comercialIsChecked = false;
  public financeiroIsChecked = false;
  public fiscalIsChecked = false;
  public supervisaoIsChecked = false;
  public suporteIsChecked = false;

  public filtered:any[] = [];
  private indexCount: number = 0;
  private carregado : Boolean = false;
  public queryText : string = '';
  private searchParceiro : boolean = false;
  private showParceiros : boolean = false;

  private emailBtn : any = {
    value: 'Copiar',
    color: 'secondary'
  };

  private telefoneBtn : any = {
    value: 'Copiar',
    color: 'secondary'
  };

  //Form Variaveis
  private origem = '';

  constructor(
    private parceiroService:ParceirosService,
    private contatoService:ContatosService,
    private gruposService : GruposService,
    private designProccess:ProcessosService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    public modalController: ModalController,
    public popoverController: PopoverController,
    private navCtrl:NavController,
    private eventEmitterService: ProvEmitterEventService,
    private srvConversas:ConversasService
  ) { }

  ngOnInit() {

    this.contatoId = this.data.contatoUid;

    console.log(this.contatoId);
    this.gruposSubscription = this.gruposService.getAll().subscribe(data=>{
      this.gruposSubscription.unsubscribe();
      this.grupos = data;

      if (this.contatoId){
        try
        {
            this.abrirdadosContato(this.contatoId)
        }
        catch(err)
        {
          console.log('Falha ao registrar subscribe de contatos ');
        }
      }
    }); 
  }
  async abrirdadosContato(contatoid:any)
  {
    console.log('Abrir dados do contato');
           this.contatoSubscription = await this.contatoService.get(contatoid).subscribe(data => {
            
            this.dadosContato = data;
            this.dadosContato.id = this.contatoId
          });
  }
  ngAfterViewInit(){
    
  }
  ionViewDidEnter(){

  }

  ngOnDestroy(){
    // this.contatoSubscription.unsubscribe();
  }
  async agendarChat(dados:any)
  {
    this.designProccess.presentLoading('Agendando conversa...')
    .then(async resLoading=>{
      resLoading.present();
      this.srvConversas.agendarChat(dados)
      .then(res=>{
        this.designProccess.presentToast(
          'Assim que '+dados.nome+' liberar aviso você.!',
          'success',
          0,
          true
        )
      })
      .catch(err=>{
        console.log(err);
        this.designProccess.presentToast(
          'Houve um problema ao tentar agendar conversa.',
          'danger',
          0,
          true
        )
      })
      .finally(()=>{
        resLoading.dismiss();
      })


    })
    .catch(err=>{
      console.log(err)
    })
  }
  async startConversa(dados:any)
  {

    this.designProccess.presentLoading('Preparando conversa...')
    .then(async resLoading=>{
      resLoading.present();

      await this.srvConversas.startChat(dados)
      .then(resStart=>{
        console.log('Conversa preparada')
        this.functionExecute('chatConversaOpen',{contatoUid:resStart.contatoUid,conversaUid:resStart.conversaUid})
      })
      .catch(errStart=>{
        console.log(errStart);
        if(errStart.code == 1)
        {
          this.designProccess.presentAlertConfirm(
            dados.nome+' em '+dados.canal+' está ocupado(a) ',
            'Você quer deixar um lembrete agendado para quando desocupar?',
            'Sim',
            'Não'
          )
          .then(resConfirm=>{
            if(resConfirm)
            {
              this.agendarChat(dados);
            }
          })
          
        }
        else
        {
          this.designProccess.presentToast(
            'Houve um problema ao tentar iniciar conversa.',
            'danger',
            0,
            true
          )
        }
       
      })
      .finally(()=>{
        resLoading.dismiss();
      })
    })
   
  }
  async novaConversa(item:any)
  {
    if(item.canal == 'whatsapp')
    {
      this.startConversa(item);
    }
    else
    {
      this.designProccess.presentToast(
        'Você nào pode iniciar uma conversa através deste canal',
        'secondary',
        0,
        true
      )
    }
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
  
  parceiroSearch(event : any) {
    console.log(event.target.value);
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.parceirosItems; // Original array with food elements can be [] also
      this.showParceiros = false;
    }
    else{
      const filter = this.queryText.toUpperCase();

      this.filtered = this.parceirosItems.filter((item) => {
        if (item.nome != undefined && item.nome != '') {
          for (let i = 0; i < item.nome.length; i++) {
            let parceiroNome = item.nome || ' ';
            let parceiroApelido = item.nome || ' ';
            let parceiroDocumento = item.documento;
            parceiroDocumento = parceiroDocumento + ' ';
            
            if (parceiroNome.toUpperCase().indexOf(filter) > -1) {
              this.showParceiros = true;
              return item.nome;
            }
          }
        }
        else {
          console.log('parceiro sem nome !');
        }
      });
    }
  }

  enableSearch(){
    this.showParceiros == false ? this.showParceiros = true : this.showParceiros = false;
  }

  loadContato(): Promise<Boolean> {

    return new Promise((resolve, reject) => {

      
    });
  }

  generateColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  setMask(){
    let canal = this.dadosContato.canal;

    if (canal == 'email') {
      this.actualMask ='A*@A*.S*.A*';
      this.canalNome = 'Email';
    }
    if (canal == 'whatsapp') {
      this.actualMask = '+00 (00) 00000-0000';
      this.canalNome = 'WhatsApp';
    }
    if (canal == 'whatsappdirect') {
      this.actualMask = '+00 (00) 00000-0000';
      this.canalNome = 'WhatsApp Chat API';
    }
    if (canal == 'telfixo') {
      this.actualMask = '+00 (00) 0000-0000';
      this.canalNome = 'Telefone';
    }
    if (canal == 'telegram') {
      this.actualMask = '000000000000000000000';
      this.canalNome = 'Telegram';
    }
    if (canal == 'facebook') {
      this.actualMask = '000000000000000000000';
      this.canalNome = 'Facebook';
    }
  }

  contatoCheckboxes(ev : any, name : string) {

    let isChecked = ev.currentTarget.checked;

    switch (name) {
      case 'livechat':
        !isChecked ? this.liveChatIsChecked = true : this.liveChatIsChecked = false;
        break;

      case 'favorito':
        !isChecked ? this.favoritoIsChecked = true : this.favoritoIsChecked = false;
        break;

        
      //Notificações

      case 'administracao':
        !isChecked ? this.administracaoIsChecked = true : this.administracaoIsChecked = false;
        break;
      case 'atendimento':
        !isChecked ? this.atendimentoIsChecked = true : this.atendimentoIsChecked = false;
        break;
      case 'cadastro':
        !isChecked ? this.cadastroIsChecked = true : this.cadastroIsChecked = false;
        break;
      case 'comercial':
        !isChecked ? this.comercialIsChecked = true : this.comercialIsChecked = false;
        break; 
      case 'financeiro':
        !isChecked ? this.financeiroIsChecked = true : this.financeiroIsChecked = false;
        break;
      case 'fiscal':
        !isChecked ? this.fiscalIsChecked = true : this.fiscalIsChecked = false;
        break;
      case 'supervisao':
        !isChecked ? this.supervisaoIsChecked = true : this.supervisaoIsChecked = false;
        break;
      case 'suporte':
        !isChecked ? this.suporteIsChecked = true : this.suporteIsChecked = false;
        break;
    
      default:
        break;
    }
  }
  
  async submitForm()
  {


    if(!this.dadosContato.favorito) this.dadosContato.favorito = false; 
    if(!this.dadosContato.livechat) this.dadosContato.livechat = false; 

    //Notificacoes
    this.dadosContato.atendimento = this.atendimentoIsChecked;
    this.dadosContato.cadastro = this.cadastroIsChecked;
    this.dadosContato.comercial = this.comercialIsChecked;
    this.dadosContato.financeiro = this.financeiroIsChecked;
    this.dadosContato.fiscal = this.fiscalIsChecked;
    this.dadosContato.supervisao = this.supervisaoIsChecked;
    this.dadosContato.suporte = this.suporteIsChecked;
    this.dadosContato.administracao = this.administracaoIsChecked;
    
    if(this.dadosContato.canal == 'whatsapp' || this.dadosContato.canal == 'whatsappdirect')
    {
      let dadosOrigem = this.dadosContato.origem;
      dadosOrigem = dadosOrigem.replace("+","")
      dadosOrigem = dadosOrigem.replace("(","")
      dadosOrigem = dadosOrigem.replace(")","")
      dadosOrigem = dadosOrigem.replace("-","")
      dadosOrigem = dadosOrigem.replace(" ","")
      dadosOrigem = dadosOrigem.replace(" ","")
      console.log('Numero higienizado '+dadosOrigem);
      this.dadosContato.origem = dadosOrigem
    }

    if (!this.contatoId) {
      console.log('Setar Empresa nova');
      this.dadosContato.uidClienteVinculado = '';
      this.dadosContato.nomeClienteVinculado = '';
    }


    console.log(this.dadosContato);

    if (this.contatoId) {
      //ATUALIZAR DADOS
      await this.designProccess.presentLoading('Atualizando...')
      .then((res)=>
      {
        res.present();
        this.contatoService.update(this.contatoId,this.dadosContato)
        .then(()=>{
          this.designProccess.presentToast(
            'Alterado com sucesso',
            'success',
            3000
            );
            // this.functionExecute('chatContatoHome',{});
        })
        .catch((err)=>{
          this.designProccess.presentToast(
            'Falha ao atualizar contato '+err,
            'danger',
            4000
          );
        })
        .finally(()=>{
          res.dismiss();
          this.modalController.dismiss();
        });
      });

    }
    else
    {
      //ADICIONAR NOVO 
      console.log('Iniciando cadastro de contato');
      console.log(this.dadosContato)
      //this.dadosContato.favorito = this.favorito_checkbox;
      this.contatoService.add(this.dadosContato)
      .then((resAdd)=>{
        this.contatoId = resAdd;
        this.abrirdadosContato(resAdd)
        
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
      });
    }
  }

  async delete()
  {

    await this.designProccess.presentAlertConfirm(
      'Excluir!',
      'Posso excluir este contato?',
      "Pode!",
      "Nem pensar..."
    )
    .then((resp)=>
    {
      
      if(resp)
      {
        //OK
        this.contatoService.delete(this.contatoId)
        .then(()=>{
          this.designProccess.presentToast(
            'Contato deletado com sucesso ',
            'success',
            3000
          );
          this.modalController.dismiss();
          this.functionExecute('chatContatoHome',{});
        })
        .catch((err)=>{
          this.designProccess.presentToast(
            'Falha ao deletar contato '+err,
            'success',
            3000
          )
        })
      }

    })
    .catch(()=>{

    })
  }

  public copyForClipboard(event: MouseEvent, input : any): void {
    try {
      event.preventDefault();
      const payload: string = input.data;
  
      let listener = (e: ClipboardEvent) => {
        let clipboard = e.clipboardData || window["clipboardData"];
        clipboard.setData("text", payload.toString());
        e.preventDefault();
      };
  
      document.addEventListener("copy", listener, false)
      document.execCommand("copy");
      document.removeEventListener("copy", listener, false);

      this.designProccess.presentToast( 
        'Copiado com sucesso',
        'success',
        3000
      );

    } 
    catch (error) {
      this.designProccess.presentToast(
        'Falha ao copiar '+error,
        'danger',
        3000
      );
    }
  }

  copyUndo(){
  }

  estadoSelect(estadoSigla : string){

    this.cidades = [];

    this.dataEstados.default.estados.forEach(estado => {
      if (estado.sigla == estadoSigla) {
        estado.cidades.forEach(cidade => {
          this.cidades.push(cidade);
        });
      }
    });

    this.dadosContato.cidade = '';
  }
}
