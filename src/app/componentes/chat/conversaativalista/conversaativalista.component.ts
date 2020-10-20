import { AngularFireAuth } from '@angular/fire/auth';
import { AddPage } from './../../../pages/comercial/add/add.page';

import { ModalArquivosHomePage } from 'src/app/modals/arquivos/modal-arquivos-home/modal-arquivos-home.page';

import { ProvEmitterEventService } from './../../../provider/prov-emitter-event.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Component, OnInit, Input } from '@angular/core';


import { Subscription, Observable } from 'rxjs';
import { Platform, PopoverController, ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { PopoverhomemenuPage } from 'src/app/popover/popoverhomemenu/popoverhomemenu.page';
import { UserService } from 'src/app/services/global/user.service';
import { Itseguserlogado } from 'src/app/interface/seguranca/itseguserlogado';

import { AuthService } from 'src/app/services/seguranca/auth.service';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { Conversas } from 'src/app/interface/chat/conversas';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { environment } from 'src/environments/environment';

interface Sound {
  key: string;
  asset: string;
  isNative: boolean
}
@Component({
  selector: 'app-conversaativalista',
  templateUrl: './conversaativalista.component.html',
  styleUrls: ['./conversaativalista.component.scss'],
})
export class ConversaativalistaComponent implements OnInit {

  @Input() data: any;

  private currentUser:Itseguserlogado;
  private userDadosAFA : any = {
    displayName: '',
    photoURL: 'src/assets/img/default-user-icon.jpg',
    email: '',
    telefone: '',
    senha: '',
    senha2: '',
    senha3: '',
  };
  
  public canaisChecados:boolean = false;
  public qtdCanais:number = 0;
  

  public filtered:any[] = [];
  public conversasSubscription: Subscription;
  public queryText : string = '';

  public primeiroLoadMsg:boolean = true;
  public qtdConversas:number=0;
  public ambiente:string;

 
  private CalcularDiff(dt2:Number, dt1:Number) 
  {
    try
    {
      var diff =(<any>dt2 - <any>dt1);
      //diff /= (60 * 60);
      
      //diff = diff / 60000;
      return Math.floor(diff/1000/60)
      //return Math.abs(Math.round(diff));
    }
    catch(err)
    {
      return 0;
    }
   
    
  }


  //AUDIO PLAY
  private forceWebAudio: boolean = true;
  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  constructor(
    public conversasService:ConversasService,
    public design:ProcessosService,
    private eventEmitterService: ProvEmitterEventService,
    private plataforma : Platform,
    private popoverController:PopoverController,
    private auth:AuthService,
    public actionSheetController: ActionSheetController,
    private ctrlModal:ModalController,
    private nativeAudio: NativeAudio,
    private globalService:UserService,
    private ctrlToaster:ToastController,
    private afa:AngularFireAuth,
    private modal:ModalController,

  ) { 
    this.ambiente = environment.firebase.projectId;
    this.filtered = [];
    this.conversasSubscription = new Subscription;

    this.auth.getCUrrentUser()
    .then(res=>{
      
      this.currentUser = res;
      console.log(this.currentUser)

      //CARREGAR SOUND BEEP
      if(this.plataforma.is('cordova') && !this.forceWebAudio){

        this.nativeAudio.preloadSimple('uniqueId1','src/app/assets/sound/beep_beep.mp3')
        .then(ret=>{
          alert('carregou')
          
         
        })
        .catch(err=>{
          console.log(err)
          alert('ruins2'+err)
        })
        .finally(()=>{

        })
      }
      else

      {
        let audio = new Audio();
        audio.src = '../../../../assets/sound/beep_2012_sms.mp3';

        this.sounds.push({
          key: 'uniqueId1',
          asset: audio.src,
          isNative: false
        });
       
      }
      


    })
    .catch(err=>{
      console.log(err);
      this.design.presentToast(
        'Falha ao identificar usuario ativo. tente fechar a aplicação e abrir novamente.',
        'warning',
        0,
        true
      )
    })
    .finally(()=>{
      console.log('Beep carregado')
      
    })
  }

  ngOnInit()
  {
    this.userDadosAFA = {
      displayName: this.afa.auth.currentUser.displayName,
      photoURL: this.afa.auth.currentUser.photoURL,
      email: this.afa.auth.currentUser.email,
      telefone: this.afa.auth.currentUser.phoneNumber,
      senha: '',
      senha2: '',
      senha3: '',
    };
  }

  ngDoCheck(){
    this.userDadosAFA = {
      displayName: this.afa.auth.currentUser.displayName,
      photoURL: this.afa.auth.currentUser.photoURL,
      email: this.afa.auth.currentUser.email,
      telefone: this.afa.auth.currentUser.phoneNumber,
      senha: '',
      senha2: '',
      senha3: '',
    };
  }

  ngAfterViewInit() {


    this.globalService.conversas = [];
    this.conversasSubscription = this.conversasService.getAllUser().subscribe(data=>{
      let notificacoes = [];
      let qtdAtualSubscribe = data.length
      if(qtdAtualSubscribe < this.qtdConversas )
      {
        
        this.globalService.conversas = [];
        this.primeiroLoadMsg = true;
      }
      
      data.forEach(conversasRecebida=>
      {
        
     
        let chave = conversasRecebida.id;
        
        const tagSemRespostaTime = this.CalcularDiff( new Date().getTime(), conversasRecebida.ultMensagemData );
          const tempoAdmitido = Number(this.globalService.dadosLogado.confEmpAtendimento.atdMinAlerta);
         
          let tagSemResposta = 0;
          
          if(conversasRecebida.ultMensagemData > 0 )
          {
            if(tagSemRespostaTime > tempoAdmitido )
            {
           
              tagSemResposta = 1;
              conversasRecebida.slaAlerta = true;
              //UPDATE PARA ALERTA ATIVO
            }
            else{
              conversasRecebida.slaAlerta = false;
            }
          }
     
        //let checkConversa  =this.conversas.findIndex(x => x.id === chave);

        let checkConversa = this.globalService.conversas.reduce( function( cur, val, index ){

            if( val.id === conversasRecebida.id && cur === -1 ) {
                return index;
            }
            return cur;
        
        }, -1 );

        if(checkConversa >-1)
        {

          //alert(this.afa.auth.currentUser.displayName+"["+conversasRecebida.contatoNome+"->"+1111+"-"+conversasRecebida.usuarioUid+"--->"+this.afa.auth.currentUser.uid)
          if(conversasRecebida.qtdA > this.globalService.conversas[checkConversa].qtdA)
          {

            if(this.globalService.conversaUidAtiva != this.globalService.conversas[checkConversa].id)
            {
              let checkNotificacao = notificacoes.reduce( function( cur, val, index ){

                  if( val.conversaUid === conversasRecebida.id && cur === -1 ) {
                      return index;
                  }
                  return cur;
              
              }, -1 );

              if(checkNotificacao >-1)
              {
                //EXISTE
              
              }
              else
              {

                if(this.globalService.conversaUidAtiva != conversasRecebida.id)
                {
                  if(!this.primeiroLoadMsg)
                  {
                    const dadosNot = {
                      conversaUid:conversasRecebida.id,
                      msg:'Nova(s) mensagem(ns) de '+conversasRecebida.contatoNome
                    }
                    notificacoes.push(dadosNot)
                  }
                  
                }
              

              }
            }

            
            
          }
         
          if(conversasRecebida.usuarioUid != this.afa.auth.currentUser.uid)
          {
           
              this.globalService.conversas.splice(checkConversa,1);
           
        
            
          }
          
          
          
          this.globalService.conversas[checkConversa] =  conversasRecebida
       

          
          



        }
        else
        {
            if(!this.primeiroLoadMsg)
            {
              const dadosNot = {
                conversaUid:conversasRecebida.id,
                msg:'Nova(s) mensagem(ns) de '+conversasRecebida.contatoNome
              }
              notificacoes.push(dadosNot)
            }
            
            this.globalService.conversas.push(conversasRecebida)
         
         
         
        }
       
      })


      //ATUALIZAR QTD CONERSAS
      this.qtdConversas = this.globalService.conversas.length;
      

      //VERIFICAR NOTIFICACOES
      if(notificacoes.length > 0)
      {
        console.log('Notify exist')
        this.notificacaoBalao(notificacoes)
      }
      else
      {
        console.log('Notify not exist')
      }
      
      

    
   
      this.qtdConversas = this.globalService.conversas.length;
      this.filtered = this.globalService.conversas;

    
      this.filtered = this.filtered.sort(function (a, b){
         return a.createAt-b.createAt
      })// Original array with food elements can be [] also
      this.filtered = this.filtered.sort(function(a,b){return b.favorito-a.favorito});
      this.primeiroLoadMsg =false;  

      
    

    })

  


  }
  
 
  filtredDados(dadosConversa:Conversas)
  {
    this.filtered.push(dadosConversa)
    this.filtered = this.filtered.sort(function (a, b){
       return a.createAt-b.createAt
    })// Original array with food elements can be [] also
    this.filtered = this.filtered.sort(function(a,b){return b.favorito-a.favorito});

  }
  async notificacaoBalao(dadosNotificacao:any)
  {

    console.log('Check Notificacoes')
    if(dadosNotificacao.length > 0 )
    {
      
      console.log(dadosNotificacao)

      


      if(!this.plataforma.is('hybrid'))
      {
        
        let mensagem = '';
        dadosNotificacao.forEach(element => {
          mensagem = mensagem + element.msg+'\n'
        });
         const toastP = await this.ctrlToaster.create({
          message:mensagem,
          duration: 3000,
          position: 'top',
          cssClass:'ctrltoastnot'
        })
        toastP.present().then(()=>{
          this.play('uniqueId1')
        })

      } 

    }
   

    

    
  }
  play(key: string): void {

    console.log('Play start ');

    if(!this.plataforma.is('hybrid'))
    {
      let soundToPlay = this.sounds.find((sound) => {
        return sound.key === key;
      });
  
      if(soundToPlay.isNative){
  
        this.nativeAudio.play(soundToPlay.asset).then((res) => {
          console.log(res);
        }, (err) => {
          console.log(err);
        });
  
      } else {
  
        this.audioPlayer.src = soundToPlay.asset;
        this.audioPlayer.play();
  
      }
    }
    else
    {
      console.log('BEEP desativado');
    }
   

  }

  ngOnDestroy(){
    //this.conversasSubscription.unsubscribe();
  }
  functionExecute(functionName:string,params:any)
  {


    //CHECAR SE é conversa 
    if(functionName == 'chatConversaOpen')
    {
      console.log('SET conversation active')
      this.globalService.conversaUidAtiva =  params.conversaUid;
    }

    


    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  async presentPopover(ev)
  {
    const popover = await this.popoverController.create({
      component:PopoverhomemenuPage,
      event: ev,
      translucent: true
    });
    await popover.present();

  }
  conversaSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.globalService.conversas; // Original array with food elements can be [] also
    } else {
      const filter = this.queryText.toUpperCase();

      this.filtered = this.globalService.conversas.filter((item) => {
        for (let i = 0; i < item.contatoNome.length; i++) {
          let contatoNome = item.contatoNome;
          let contatoEmpresa = item.nomeClienteVinculado || '';
          let contatoOrigem = item.contatoOrigem;
          contatoOrigem = contatoOrigem + "";
          
          if (contatoNome.toUpperCase().indexOf(filter) > -1 || contatoEmpresa.indexOf(filter) > -1 || contatoOrigem.indexOf(filter) > -1) {
            return item.contatoNome;
          }
        }
      })
    }
  }

  async modalArquivos() {
    const modal = await this.modal.create({
      component: ModalArquivosHomePage,
      mode: 'ios',
      showBackdrop: false,
      cssClass:'selector-modal',
      componentProps: {
      }
    });
    await modal.present();
  }


 
}
