import { WatsonService } from './../../../services/lara/watson.service';

import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { createAnimation, Animation } from '@ionic/core';
import { AnimationController } from '@ionic/angular';



import { ConversaIA } from 'src/app/interface/lara/conversa-ia';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild("button", { read: ElementRef, static: true }) button: ElementRef
  matches2:string
  isRecording = false;

  public pulseBtnBlue:any;
  public pulseBtnRed:any;

 
  public dadosConversa: ConversaIA = {};
  

  public laraSubscription: Subscription;
 

  public uidMsg:string = '';

  public contextAtual:string = '';
  
  

  constructor(
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech,
    private authService:AuthService,
    private agAuth:AngularFireAuth,
    private animationCtrl: AnimationController,
    private watsonService:WatsonService
    
  ) 
  { 

  
    let apikey  = 'apikey:l1wwpPbPxKL6pFuc8hm2j7xjoBqJ5B1kNuKAgXPPlka-';
    
    let workId  = '5383f048-eaed-4d1e-960e-1dec833e871f';
    let context = '';
    let version = '2019-02-28';
    const url   = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/message?version=${version}`;
    const contextInicial = {
      user_nome:this.agAuth.auth.currentUser.displayName,
      cont_nao_entendeu:0,
      timezone:"America/Sao_Paulo"
    }
    this.dadosConversa.contexto = JSON.stringify(contextInicial)

  }
  ngAfterViewInit(){
    this.formatpulse()
    
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

      console.log('Pulsos formatados');

    
  }

 
  async getPermission() {
    await this.speechRecognition.hasPermission().then((hasPermission:boolean)=>{
      
      console.log("Verificando permissão")
      if(!hasPermission)
      {
        this.speechRecognition.requestPermission().then(()=>{
          console.log("Recotnize autorizado ");
         //this.startListening();
          
        }).catch(()=>{
          console.log("Não autorizado ")
          
        })
      }
      else
      {
       //this.startListening();
      }
    })
  }

  startListening() {
    try{
      this.pulseBtnRed.play();
      this.isRecording = true;
      let options = {
        language: 'pt-BR',
        matches:1,
        showPopup:false
      }
      this.speechRecognition.startListening(options).subscribe((matches:Array<string>) => {
        this.matches2 = matches[0];
        this.pulseBtnRed.stop();
        this.isRecording = false;
        this.sendProcessoLara(this.matches2);
        
      })
    }
    catch(err)
    {
      this.isRecording = false;
      this.pulseBtnRed.stop();
    }
    
    
    
  }
  sendProcessoLara(mensagem:string)
  {
    
    let nomeUsuario = this.agAuth.auth.currentUser.displayName;
  

    this.dadosConversa.textoProcessar = mensagem

    console.log('Processar os dados de conversa')
    console.log(this.dadosConversa);

    
    this.watsonService.add(this.dadosConversa)
  
    .then((res)=>{
      this.uidMsg = res.id;
      console.log('Enviado para processamento '+this.uidMsg)


      this.laraSubscription = this.watsonService.get(this.uidMsg).subscribe(data => {
        this.dadosConversa = data;
        
        if(data.textReturn!= '')
        { 
          this.dadosConversa.contexto = data.contexto;
          console.log('Falar: '+data.textReturn);
          this.LaraFalar(data.textReturn);
        }
        
      })


    })
    .catch((err)=>{
      console.log('Erro no processo')
      console.log(err);
    })
    
 
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
    .then(() =>{

      console.log('Success')
      
    } )
    .catch((reason: any) => console.log(reason))
    .finally(()=>{
      this.pulseBtnBlue.stop();
      
      //VERIFICAR ACOES DO CONTEXTO
      if(this.dadosConversa.contexto)
      {
        console.log('Enviando contexto atual');
        const context = JSON.parse(this.dadosConversa.contexto)
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


    })
  }
  async ProcessarTexto()
  {
    this.dadosConversa.textoProcessar = "Como você pode me ajudar?"
    this.watsonService.add(this.dadosConversa)
  
    .then((res)=>{
      this.uidMsg = res.id;
      console.log('Enviado para processamento '+this.uidMsg)


      this.laraSubscription = this.watsonService.get(this.uidMsg).subscribe(data => {
       
        if(data.textReturn!= '')
        {
          this.contextAtual = data.contexto
          console.log('Falar: '+data.textReturn);
          this.LaraFalar(data.textReturn);
        }
        
      })


    })
    .catch((err)=>{
      console.log('Erro no processo')
      console.log(err);
    })
    
   
  }

  ngOnInit() {
  
    this.speechRecognition.isRecognitionAvailable()
    .then((available: boolean) =>{
      console.log('Recognize disponivel ... ');
      this.getPermission();
    })
    .catch((err)=>{
      console.log('Recognize não disponivel');
      //MDANR PARA CHAT DIGITADO
    })
  
  }

 

  

}
