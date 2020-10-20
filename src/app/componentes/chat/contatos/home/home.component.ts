
import { PopovercontatoshomeopcoesitensselecionadosPage } from './../../../../popover/contatos/home/popovercontatoshomeopcoesitensselecionados/popovercontatoshomeopcoesitensselecionados.page';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ConversasService } from 'src/app/services/chat/conversas.service';




import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { Subscription } from 'rxjs';
import { Contatos } from 'src/app/interface/chat/contatos';
import { ModalController, PopoverController } from '@ionic/angular';

import { AddPage } from './../../../../pages/comercial/add/add.page';
import { FiltrosPesquisaTransmissaoPage } from 'src/app/modals/lista-transmissao/filtros-pesquisa-transmissao/filtros-pesquisa-transmissao.page';
import { ModalcontatofiltrosPage } from 'src/app/modals/chat/modalcontatofiltros/modalcontatofiltros.page';
import { QueryFn } from '@angular/fire/firestore';
import { ModalgruposelecionarPage } from './../../../../modals/grupos/modalgruposelecionar/modalgruposelecionar.page';

import { AngularFireFunctions } from '@angular/fire/functions';
import { UserService } from 'src/app/services/global/user.service';
import { ModalchatconversastartPage } from 'src/app/modals/chat/conversas/starconversa/modalchatconversastart/modalchatconversastart.page';
import { PopovercontatosconversastartPage } from 'src/app/popover/contatos/conversa/popovercontatosconversastart/popovercontatosconversastart.page';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Input() data: any;
  @ViewChild("fab", { read: ElementRef, static: true }) fab:  ElementRef

  private itemsSubscription: Subscription;
  public items = new Array<Contatos>();
  public filtered:any[] = [];
  private loaded : any[] = [];
  public queryText : string = '';
  public currentUserUid:string = '';
  private startAfter:any = '';
  private activeChip : string = 'none';
  private contatosLength : number = 0;
  private listasLength : number = 0;

  public scrollAuto:boolean = false;
  public filterString:string = 'nome'
  public selecionarItem:boolean;
  public itensSelecionados = [];

  private queryStr:QueryFn;
  private buscaBarra:String = ''
  private contatosList = []
  private loadingProccess:boolean = true;
  private filtroCheckboxes = {
    contatos: 'secondary',
    listas : 'secondary',
    
  };

  public canaisChatAtivo:number = 0


  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private contatoService:ContatosService,
    private conversaService:ConversasService,
    private design:ProcessosService,
    private afa:AngularFireAuth,
    private popoverController: PopoverController,
    private ctrlModal:ModalController,
    private afFunction:AngularFireFunctions,
    private global:UserService,

  ) { }

  ngOnInit() {

  console.log('Listed contact');
  if(this.global.contatosList.length == 0)
  {
    this.carregarContatos('')
  }
  else
  {
    if(this.data.limpardados)
    {
      this.carregarContatos('')
    }
    else
    {
      this.loadingProccess = false
      this.contatosList = this.global.contatosList
    }
    
  }
   
   this.contatoService.canaisGet().then(res=>{
     this.canaisChatAtivo = res
   })
   
  }
  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
 
  selecionarFraseStart(dados:any)
  {
    this.abrirTemplates(dados)
  }
  editar(uid:string)
  {
    this.functionExecute('compchatcontatoedit',{contatoUid:uid})
  }
  carregarContatos(valor?:string)
  {

    const params ={
      consultarPor:valor,
   

     
    }
    this.loadingProccess = true
    console.log('Consultar '+JSON.stringify(params))
    this.contatosList = []
    this.global.contatosList = []
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
            this.global.contatosList.push(dadosItem)
            this.contatosList.push(dadosItem)
            //console.log(dadosItem)
          });
        }
        else
        {
          this.loadingProccess = false
          this.contatosList = []
          this.global.contatosList = []
        }
          
         
        
      }
      else
      {
        this.loadingProccess = false
        this.contatosList = []
        this.global.contatosList = []
      }

    })
  
    
  
  }
  testeFunction2()
  {
    const callable = this.afFunction.httpsCallable('appContatosConsulta',);
    const obs = callable({ coolMsg: 'dados enviados' });
    obs.subscribe(async (res:any) => {
      alert(res.msg)
      //const alert = await this.alertController.create({
      //  header: `Time: ${res.date}`,
      //  message: res.msg,
      //  buttons: ['OK']
      //});
      //await alert.present();
    });
  }
  async abrirTemplates(dadosContato:any)
  {
  

    const modal = await this.ctrlModal.create({
      component: ModalchatconversastartPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        origem:'homecontatos'
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        
          const starConversa = {
            canal:'whatsappDirect',
            frase:dados.data.frase,
            dadosContato
          }
          this.design.presentToast(
            'Este canal ainda não está liberado para enviar mensagens',
            'warning',
            0,
            true
          )
          //this.startConversa(starConversa)
      }
    })

    await modal.present();
  }
  async popoverItem(ev:any,item:any)
  {
    console.log(item)
    const popover = await this.popoverController.create({
      component:PopovercontatosconversastartPage,
      event: ev,
      translucent: true,
      componentProps: {
        item
      }
    });

    popover.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados.data == 'whatsappDirect')
      {
        this.selecionarFraseStart(item)
      }
      else if(dados.data == 'whatsapp')
      {
        const starConversa = {
          canal:'whatsApp',
          frase:'',
          dadosContato:item
        }
        this.conversaIniciar(starConversa)
      }
      else
      {
        console.log('Canal não especificado '+dados.data.canal )
        this.design.presentToast(
          'Canal não especificado',
          'danger',
          0,
          true
        )
      }

    })
    await popover.present();

  }
  async conversaIniciar(dados:any){
    //MODELO DE DADOS
    //const starConversa = {
    //  canal:'whatsapp',
    //  frase:dados.data.frase,
    //  dadosContato:dados
    //}

    //console.log(dados)
    this.design.presentLoading('Iniciando conversa...')
    .then(resLoading=>{
      resLoading.present()

      this.conversaService.conversaVerificar(dados).then(resConversa=>{
        
        if(resConversa.situacao == 'suc')
        {
          const data = resConversa.data.data[0]
          if(data.length == 0)
          {
            //CRIAR CONVERSA AQUI 
            this.conversaService.conversaIniciar(dados).then(resStart=>{
              console.log('Conversa iniciada com sucesso')
            })
            .catch(errStart=>{
              console.log(errStart)
              this.design.presentToast(
                'Falha ao iniciar a conversa',
                'danger',
                0,
                true
              )
            })
            .finally(()=>{
              resLoading.dismiss()
            })
          }
          else
          {
            console.log('Ja tem ')
          }
    
         
        
          
        }
      })
      .catch(err=>{
        resLoading.dismiss()
        console.log(err)
        this.design.presentToast(
          'Falha ao iniciar conversa',
          'danger',
          0,
          true
        )
      })
      .finally(()=>{
        
      })

    })
    

    
  }
  async conversaIniciarDireto(canal:string,dados:any)
  {
    const starConversa = {
      canal,
      frase:'',
      dadosContato:dados
    }
    this.conversaIniciar(starConversa)
  }
  async criarLista(){
    
    return this.design.presentToast(
      'Esta função esta temporariamente indisponivel. Tente novamente mais tarde',
      'warning',
      0,
      true
    )
    const modal = await this.ctrlModal.create({
      component: FiltrosPesquisaTransmissaoPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass:'selector-modal',
    });

    await modal.present();
  }


  ionViewDidEnter(){
  }
 
  selecionarTodos()
  {
    console.log('selecionar todos')
    this.items.forEach(dados=>{
      dados.selecionado  = true;
      
    })
  }
  limparTodos()
  {
    console.log('limpar todos')
    this.items.forEach(dados=>{
      dados.selecionado  = false;
      
    })
  }
  async grupoSelecionar(itens:any) {
    const modal = await this.ctrlModal.create({
      component: ModalgruposelecionarPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // 
      componentProps: {
       dados:itens
      }
    });
    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        
       
      }
    })
    return await modal.present();
  }

  async popoverFiltrosOpacao(ev: any) {
    const popover = await this.popoverController.create({
      component: PopovercontatoshomeopcoesitensselecionadosPage,
    
      event: ev,
      translucent: true,
      componentProps: {
       qtdItens:this.items
      }
    });
    popover.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        if(dados.data == 'selecionar')
        {
          this.selecionarTodos();
        }
        if(dados.data == 'limpartodos')
        {
          this.limparTodos();
        }
        if(dados.data == 'grupo')
        {
          const dadosSelecionados = this.items.filter(function(event){
           
            return event.selecionado
          })
          if(dadosSelecionados.length > 0)
          {
              this.grupoSelecionar(dadosSelecionados)
          }
          else
          {
            this.design.presentToast(
              'Selecione os cadastros antes de continuar',
              'secondary',
              0,
              true
            )
          }
        }
      }
    })
    return await popover.present();
  }
  searchonCancel(event:any){
    alert('Cancel');
  }

  async search(event:any)
  {
    this.selecionarItem = false;
    if(event == '')
    {
      this.fristLoad();
    }
    else
    {
      this.scrollAuto = false;
      this.items = [];
      this.filtered = [];

      this.contatoService.getFilter(event,this.filterString).forEach(elem=>{

        if(!elem.empty)
        {
          elem.docs.forEach(elemdoc=>{
            
            const id = elemdoc.id;
            const data = elemdoc.data() as Contatos;
            const dataRetorno =  {id, ... data,elemdoc}
            
            this.items.push(dataRetorno)
          })
        }

      }) 

    }
    
  }

  async search2(event:any)
  {
    if(event == '')
    {
      this.fristLoad();
    }
    else
    {
      this.scrollAuto = false;
      this.items = [];
      this.filtered = [];
      const dados:any =  await this.contatoService.getFilter(event,this.filterString)
      this.items = dados;
      this.filtered = dados;
    }
    
  }

  fristLoad()
  {
    
    this.scrollAuto = true;
  
    this.contatoService.getFirst().forEach(dados=>{
      dados.forEach(elem=>{
        let contatoCount = 0;
        let listaCount = 0;

        this.contatoService.startAfter = elem.doc

        let checkContato = this.items.reduce(( cur, val, index ) => {

          if( val.id === elem.id && cur === -1 ) {
              
            return index;
          }
          return cur;
      
        }, -1 );
        if(checkContato == -1)
        {
          console.log('Nao existe')
          this.items.push(elem);
        }
        else
        {
          
          console.log('Ja existe')
          this.items[checkContato] = elem
        }


        
        this.filtered = this.items;

        this.filtered.forEach(contato => {
          if (contato.canal != 'lista') {
            contatoCount++;
          }
          else {
            listaCount++
          }
        });

        this.contatosLength = contatoCount;
        this.listasLength = listaCount;
      
      })
    })

    //PREPARAR FILTRO PARA SER MAIS RAPIDO
    //this.contatoService.getFilter('')
  }

  loadData(event){
    this.contatoService.getAll().forEach(data=>{
      let contatoCount = 0;
      let listaCount = 0;

      data.forEach(elem=>{
        this.contatoService.startAfter = elem.doc;

        let checkContato = this.items.reduce(( cur, val, index ) => {

          if( val.id === elem.id && cur === -1 ) {
              
            return index;
          }
          return cur;
      
        }, -1 );

        if(checkContato > -1)
        {
          //EXISTE
          //console.log('Ja existe '+elem.id+' '+elem.nome)
        }
        else
        {
          this.loaded = [];
          //console.log('Adicionando '+elem.id+' '+elem.nome)
          
          this.loaded.push(elem);

          // this.filtered = tempArray;
          // this.filtered.push(elem);
          // this.items.push(elem);

          switch (this.activeChip) {
            case 'none':
              this.loaded.forEach(contato => {
                this.items.push(contato);
              });

              this.filtered = this.items;
              break;
            case 'contato':
              this.loaded.forEach(contato => {
                if (contato.canal != 'lista') {
                  this.filtered.push(contato);
                }
              });
              break;
            case 'lista':
              this.loaded.forEach(contato => {
                if (contato.canal == 'lista') {
                  this.filtered.push(contato);
                }
              });
              break;
            default:
              break;
          }
        }

        
        
      });
      
      this.loaded.forEach(contato => {
        if (contato.canal != 'lista') {
          contatoCount++;
        }
        else {
          listaCount++;
        }
      });

      this.contatosLength = this.contatosLength + contatoCount;
      this.listasLength = this.listasLength  + listaCount;

      event.target.complete();
    })
  }

  functionExecute(functionName:string,params:any)
  {
    console.log('preparando '+functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  searchClear(event)
  {
    
    console.log('Filtro cancelado')
    this.filtered = this.items;
  }
  Closefab() {
 
    this.fab.nativeElement.close();
  }
  async agendarChat(dados:any)
  {
    this.design.presentLoading('Agendando conversa...')
    .then(async resLoading=>{
      resLoading.present();
      this.conversaService.agendarChat(dados)
      .then(res=>{
        this.design.presentToast(
          'Assim que '+dados.nome+' liberar aviso você.!',
          'success',
          0,
          true
        )
      })
      .catch(err=>{
        console.log(err);
        this.design.presentToast(
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

  async startConversaAntigo(dados:any)
  {

    this.design.presentLoading('Preparando conversa...')
    .then(async resLoading=>{
      resLoading.present();

      await this.conversaService.startChat(dados)
      .then(resStart=>{
        console.log('Conversa preparada')
        this.functionExecute('chatConversaOpen',{contatoUid:resStart.contatoUid,conversaUid:resStart.conversaUid})
      })
      .catch(errStart=>{
        console.log(errStart);
        if(errStart.code == 1)
        {
          this.design.presentAlertConfirm(
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
          this.design.presentToast(
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

  async deleteContato(id:string)
  {
    this.design.presentAlertConfirm(
      'Exclusão',
      'Confirma excluir? Esta ação não poderá ser desfeita',

    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Excluindo ...')
        .then(resLoading=>{
          resLoading.present();
          this.contatoService.delete(id)
          .then(res=>{

            let checkContato = this.items.reduce(( cur, val, index ) => {

              if( val.id === id && cur === -1 ) {
                  
                return index;
              }
              return cur;
          
            }, -1 );
            if(checkContato > -1)
            {
              this.items.splice(checkContato,1);
            }

            this.design.presentToast(
              'Excluido com sucesso',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao excluir',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoading.dismiss()
          })
        })
      }
    })
  }

  contatosFilter(filtro : string){
    const tempArray = [];

      switch (filtro) {
        case 'contatos':
          if (this.filtroCheckboxes.contatos == 'secondary') {

            this.filtroCheckboxes = { contatos: 'primary', listas: 'secondary' };

            this.items.forEach(contato => {
              if (contato.canal != 'lista') tempArray.push(contato);
            });
    
            this.filtered = tempArray;
            this.activeChip = 'contato';
          }
          else {
            this.filtroCheckboxes.contatos = 'secondary';
            this.filtered = this.items;
            this.activeChip = 'none';
          }
  
          break;
        case 'listas':
          if (this.filtroCheckboxes.listas == 'secondary') {

            this.filtroCheckboxes = { contatos: 'secondary', listas: 'primary' };

            this.items.forEach(contato => {
              if (contato.canal == 'lista') tempArray.push(contato);
            });
      
            this.filtered = tempArray;
            this.activeChip = 'lista';
          }
          else {
            this.filtroCheckboxes.listas = 'secondary';
            this.filtered = this.items;
            this.activeChip = 'none';
          }
          break;
      
        default:
          this.filtered = this.items;
          break;
      }


  }
  async filtroAvancado(dados:any)
  {
    this.selecionarItem = true;
    this.items = [];
    let filtros = [];
    

      if(dados.grupo != 'todos')
      {
        if(dados.grupo != 'vazio')
        {
        
          filtros.push({campo:'grupo',condicao:'==',valor:dados.grupo})
        }
      }

      if(dados.dataIni != '' && dados.dataFim )
      {
        let dataIniRec = dados.dataIni.split('-');
        let dataIni = new Date(Number( dataIniRec[0]),Number(dataIniRec[1])-1,Number(dataIniRec[2]),0,1).getTime()

        let dataFimRec = dados.dataFim.split('-');
        let dataFim = new Date(Number( dataFimRec[0]),Number(dataFimRec[1])-1,Number(dataFimRec[2]),23,59).getTime()

        filtros.push({campo:'createAt',condicao:'>=',valor:dataIni})
        filtros.push({campo:'createAt',condicao:'<=',valor:dataFim})

      }
     

      console.log(filtros)

      this.queryStr = ref=>{
        let qr  : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        filtros.forEach(elem=>{
          qr = qr.where(elem.campo,elem.condicao,elem.valor)
        })
        //qr.orderBy('nome','asc')
        
        return qr
      };
      this.design.presentLoading('Carregando filtro')
      .then(resLoading=>{
        console.log(1)
        resLoading.present()
        this.contatoService.Select(this.queryStr)
        .then(resAdd=>{
          console.log(2)
          resAdd.get().forEach(dadosRetorno=>{
            if(!dadosRetorno.empty)
            {
              console.log(3)
              dadosRetorno.forEach(elem=>{
                const id = elem.id;
                const data = elem.data();
                let selecionado = false;
                const itemAdd = {id,selecionado,...data}

                if(dados.grupo == 'vazio')
                {
                  if(data.grupo === undefined || data.grupo == '')
                  {
                    this.items.push(itemAdd)
                  }
                }
                else
                {
                  this.items.push(itemAdd)
                }
                
              })
            }
            else
            {
              console.log(4)
            }
          })
        })
        .catch(err=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao criar lista',
            'danger',
            0,
            true
          )
        })
        .finally(()=>{
          resLoading.dismiss();
        })
      })
      
  }
  async abrirFiltros() {
    const modal = await this.ctrlModal.create({
      component: ModalcontatofiltrosPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // 
  
   
      componentProps: {
       
      }
    });
    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        if(dados.data.acao == 'filtro')
        {
          this.filtroAvancado(dados.data.data)
        }
        
      }
    })
    return await modal.present();
  }
}
