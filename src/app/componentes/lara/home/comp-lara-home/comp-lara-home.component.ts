import { ProcessosService } from './../../../../services/design/processos.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Subscription } from 'rxjs';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import {  Platform, LoadingController } from '@ionic/angular';
import { WatsonService } from 'src/app/services/lara/watson.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { ConversaIA } from 'src/app/interface/lara/conversa-ia';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-comp-lara-home',
  templateUrl: './comp-lara-home.component.html',
  styleUrls: ['./comp-lara-home.component.scss'],
})
export class CompLaraHomeComponent implements OnInit {
  @Input() data: any;
 
  @ViewChild("button", { read: ElementRef, static: true }) button: ElementRef
  matches2:string
  isRecording = false;

  public pulseBtnBlue:any;
  public pulseBtnRed:any;

 
  public dadosConversa: ConversaIA = {};
  

  public laraSubscription: Subscription;
 

  public uidMsg:string = '';

  public contextAtual:string = '';
  public plataforma:string = 'desktop';
  private conversaAtual:any = [];
  public newMsg:string = '';
  public IaProcessado:boolean = false;
  public loading:any;
  private userCurrent : any = {};
  public laraBtn : string = 'none';
  private buttonMessage : boolean = true;

  constructor(
    private eventEmitterService:ProvEmitterEventService,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech,
    private authService:AuthService,
    private agAuth:AngularFireAuth,
    private animationCtrl: AnimationController,
    private watsonService:WatsonService,
    private platform:Platform,
    private ctrLoadind:LoadingController,
    private design:ProcessosService
  ) 
  { 
    let apikey  = 'apikey:l1wwpPbPxKL6pFuc8hm2j7xjoBqJ5B1kNuKAgXPPlka-';
    let workId  = '5383f048-eaed-4d1e-960e-1dec833e871f';
    let context = '';
    let version = '2019-02-28';
    const url   = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/message?version=${version}`;
    const contextInicial = {
      user_nome: this.agAuth.auth.currentUser.displayName,
      cont_nao_entendeu: 0,
      timezone: "America/Sao_Paulo"
    };

    this.dadosConversa.contexto = JSON.stringify(contextInicial)
    this.IaProcessado = false;
    console.log('Iniciailzando ');

    this.authService.getCUrrentUser()
    .then(res => this.userCurrent = res)
    .catch(err => 
      this.design.presentToast(
        'Falha ao identificar usuario ativo. tente fechar a aplicação e abrir novamente.',
        'warning',
        0,
        true
      )
    )
    .finally(() => console.log('Beep carregado'));
  }

  ngAfterViewInit(){
    this.formatpulse();
  }
  
  ngOnInit() {
    if(this.platform.is('hybrid'))
    {
      this.plataforma = 'hybrid';
      this.laraBtn = 'block';
    }
    else {
      this.laraBtn = 'none';
    }
    //inicializzar conversa
    this.sendProcessoLara('oi');
  }

  functionExecute(functionName:string,params:any)
  {
    console.log('preparando '+functionName);

    const param = {
      function:functionName,
      data:params
    };

    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  
  SendMsgLara()
  {
    const message = this.newMsg.replace(/\s+/g, '');

    // if(text != '')
    // {

    //   const msgRecebida = {
    //     de:'user',
    //     data:new Date().getTime(),
    //     mensagem:text
    //   }
    //   this.conversaAtual.push(msgRecebida);


    //   this.newMsg = '';
    //   this.sendProcessoLara(text)
    // }
    if(message.length < 1)
    {
      this.newMsg = '';
    }
    else {
      const msgRecebida = {
        de:'user',
        data:new Date().getTime(),
        mensagem:this.newMsg
      }
      this.conversaAtual.push(msgRecebida);

      this.sendProcessoLara(this.newMsg);
      this.newMsg = '';
    }
  }

  public animateButton() {
    const animation = this.animationCtrl
    .create()
    .addElement(this.button.nativeElement)
    .duration(1000)
    .iterations(Infinity)
    .fromTo("--background", "green", "blue")

    animation.play()
  }

  public formatpulse() {
    
    this.pulseBtnBlue = this.animationCtrl
    .create()
    .addElement(this.button.nativeElement)
    .duration(1000)
    .iterations(Infinity)
    .keyframes([
      { offset: 0, boxShadow: "0 0 0 0 rgba(44, 103, 255, 0.4)" },
      { offset: 0.7, boxShadow: "0 0 0 10px rgba(44, 103, 255, 0)" },
      { offset: 1, boxShadow: "0 0 0 0 rgba(44, 103, 255, 0)" }
    ]);
    
    this.pulseBtnRed = this.animationCtrl
    .create()
    .addElement(this.button.nativeElement)
    .duration(1000)
    .iterations(Infinity)
    .keyframes([
      { offset: 0, boxShadow: "0 0 0 0 rgba(250, 45, 62, 0.4)" },
      { offset: 0.7, boxShadow: "0 0 0 10px rgba(250, 45, 62, 0)" },
      { offset: 1, boxShadow: "0 0 0 0 rgba(250, 45, 62, 0)" }
    ]);
  }

  async getPermission() {
    await this.speechRecognition.hasPermission().then((res : boolean) => {
      console.log("Verificando permissão")
      if(!res)
      {
        this.speechRecognition.requestPermission()
        .then(() => {
          let options = {
            language: 'pt-BR',
            matches:1,
            showPopup:false
          };

          this.speechRecognition.startListening(options).subscribe((matches : Array<string>) => {
            this.matches2 = matches[0];
            this.pulseBtnRed.stop();
            this.isRecording = false;

            const msgRecebida = {
              de: 'user',
              data: new Date().getTime(),
              mensagem: this.matches2
            };

            this.conversaAtual.push(msgRecebida);
            this.sendProcessoLara(this.matches2);
          });

        })
        .catch(() => console.error("Não autorizado "))
      }
    });
  }

  async startListening() {
    if (!this.platform.is('hybrid')) {
      this.design.presentToast(
        'Função temporariamente desativada para web',
        'warning',
        3000
      );
    }
    else {
      try {
        this.pulseBtnRed.play();
        this.isRecording = true;
        await this.getPermission();
      }
      catch(err)
      {
        console.log(err)
        //this.pulseBtnRed.play();
        //this.isRecording = false;
        //this.pulseBtnRed.stop();
      }
    }
  }

  checkMsg(event : any) {
    const message = this.newMsg.replace(/\s+/g, '');

    if(!this.platform.is('hybrid'))
    {
      if (event.keyCode == 13 && !event.shiftKey) {
        if (message.length < 1 || this.newMsg == null) {
          event.preventDefault();
          this.newMsg = '';
        }
        else if(this.newMsg != '' && this.newMsg != null && this.newMsg != ' ')
        {
          event.preventDefault();
          this.SendMsgLara();
        }
      }
      else if (event.keyCode == 13 && event.shiftKey) {
        if (message.length < 1 || this.newMsg == null) {
          event.preventDefault();
          this.newMsg = '';
        }
      }
      else if (event.keyCode == 32) {
        if (message.length < 1 || this.newMsg == null) {
          event.preventDefault();
          this.newMsg = '';
        }
      }
      else {
        this.newMsg != '' && this.newMsg != null ? this.buttonMessage = false : false;
      }
    }
    else {
      if (event.keyCode == 13) {
        event.preventDefault();
        message.length < 1 || this.newMsg == null ? this.newMsg = '' : false;
        // else if(this.newMsg != '' && this.newMsg != null && this.newMsg != ' ')
        // {
        //   event.preventDefault();
        //   this.SendMsgLara();
        // }
      }
    }
  }

  async sendProcessoLara(mensagem:string)
  {
    this.IaProcessado = false;
    await this.ctrLoadind.create({message:'Processando...' })
    .then(resLoading => resLoading.present());

    let nomeUsuario = this.agAuth.auth.currentUser.displayName;

    this.dadosConversa.textoProcessar = mensagem;
    console.log('Processar os dados de conversa')
    console.log(this.dadosConversa);

    this.watsonService.add(this.dadosConversa)
    .then(res => {
      this.uidMsg = res.id;
      console.log('Enviado para processamento '+this.uidMsg)

      this.laraSubscription = this.watsonService.get(this.uidMsg).subscribe(data => {
        this.dadosConversa = data;
        
        if(data.textReturn != '')
        { 
          this.ctrLoadind.dismiss();
          this.dadosConversa.contexto = data.contexto;
          console.log('Falar: '+data.textReturn);
          const msgRecebida = {
            de: 'lara',
            data: new Date().getTime(),
            mensagem: data.textReturn
          };

          this.conversaAtual.push(msgRecebida);
          this.platform.is('hybrid') ? this.LaraFalar(data.textReturn) : this.IaProcessado = true;
        }
      });
    })
    .catch(err => console.log(`Erro: ${err}`))
    .finally(() => {});
  }

  LaraFalar(text:string)
  {
    this.laraSubscription.unsubscribe();
    this.pulseBtnBlue.play();

    this.tts.speak({
      text: text,
      rate: 1.5,
      locale: 'pt-BR'
    })
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason))
    .finally(() => {
      this.IaProcessado = true;
      this.pulseBtnBlue.stop();
      
      //VERIFICAR ACOES DO CONTEXTO
      if(this.dadosConversa.contexto)
      {
        console.log('Enviando contexto atual');
        const context = JSON.parse(this.dadosConversa.contexto);

        if(context.hasOwnProperty('acao_acionar_microfone'))
        {
          console.log('Ação de liberacao do microfone');
          if(context.acao_acionar_microfone)
          {
            //context.acao_acionar_microfone.remove();
            delete context.acao_acionar_microfone;
            this.dadosConversa.contexto = JSON.stringify(context);
            //LIBERAR MICROFONE
            console.log('Liberar microfone');
            this.startListening();
          }
        }
      }
    });
  }

  async ProcessarTexto()
  {
    this.dadosConversa.textoProcessar = "Como você pode me ajudar?"
    this.watsonService.add(this.dadosConversa)
  
    .then(res => {
      this.uidMsg = res.id;
      console.log('Enviado para processamento '+this.uidMsg);

      this.laraSubscription = this.watsonService.get(this.uidMsg).subscribe(data => {
        if(data.textReturn!= '')
        {
          this.contextAtual = data.contexto
          console.log('Falar: '+data.textReturn);
          this.LaraFalar(data.textReturn);
        }
        
      });
    })
    .catch(err => console.log(`Erro: ${err}`));
  }
}
