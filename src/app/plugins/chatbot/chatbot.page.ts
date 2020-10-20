import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage implements OnInit {
  @ViewChild(IonContent, {static: false}) content: IonContent;
  private conversaIniciada:boolean = false;
  private contatoUid:string
  private contatoNome:string
  private conversaUid:string
  private logCosole:boolean = false
  private mensagensList:any = []
  private mensagemEnviar:string = ''
  private empresaUid:string 

  private dadosIdentificacao = {
    nome:'',
    telefone:'',
    email:'',

  }

  constructor(
    private ctrlRoute:ActivatedRoute,
    private design:ProcessosService,
  
    private afFunction:AngularFireFunctions
  ) 
  { 
    this.empresaUid = 'QmPJcDIMLJBshGe9LDv2'
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    {
      this.logCosole = true
    }
   

  }
  capitalizeText(string:string) { 
   
    return string[0].toUpperCase()+string.slice(1)
  } 
  printLog(mensagem:any)
  {
    if(this.logCosole)
    {
      console.warn(mensagem)
    }
  }

  ngOnInit() {
    let params  = ''
    let token   = 'WEVRVWRuUG51eFZqbzlkcWxCaDZMM0hPT0hBMw=='
    if(this.ctrlRoute.snapshot.queryParamMap.get('params'))
    {
      params = this.ctrlRoute.snapshot.queryParamMap.get('params')
      console.log(params)
    }
    else
    {
      console.warn('Nao existem parametros')
    }
  }


  contatoIdent()
  {

    if(this.dadosIdentificacao.nome == '')
    {
      return this.design.presentToast(
        'Informe seu nome para continuar',
        'secondary',
        0,
        true
      )
    }
    if(this.dadosIdentificacao.email === '' && this.dadosIdentificacao.telefone === '')
    {
      return this.design.presentToast(
        'É necessário informar ao menos uma forma de contato',
        'secondary',
        0,
        true
      )
    }

    //VERIFICAR SE EXISTE CONTATO
    
    let checkContato:any = {} 
    checkContato.empresaUid = this.empresaUid
    if(this.dadosIdentificacao.telefone != '')
    {
      checkContato.origem_wpp = this.dadosIdentificacao.telefone
    }
    if(this.dadosIdentificacao.email != '')
    {
      checkContato.origem_email = this.dadosIdentificacao.email
    }
    console.log(checkContato)
    this.design.presentLoading('Iniciando...')
    .then(resLoading=>{
      resLoading.present()
      const callable = this.afFunction.httpsCallable('appContatoAdd')
      const obs = callable(checkContato)
      obs.subscribe(elementRetorno=>{
        console.log(elementRetorno)
        if(elementRetorno.situacao == 'suc')
        {
          resLoading.dismiss()
          
          const dadosContato = elementRetorno.data.data[0]
          this.printLog(JSON.stringify(dadosContato))
          if(dadosContato.length > 0)
          {
           
            this.dadosIdentificacao.nome = dadosContato[0].nome
            this.contatoUid = dadosContato[0].uid
            
          }
          else
          {
            //CADASTRAR NOVO CONTATO

            alert('nao tem contato')
          }


          //VERIFICAR CONVERSA ATIVA
          if(this.conversaUid === '')
          {
            alert('Nao existe conversa ativa')
          }
          else
          {
            alert('já existe conversa ativa ')
          }


          //SEGUINDO COM VERIFICACOES DA CONVERSA
          this.conversaIniciada = true;
          this.PrintSend(
            'r',
            'Lara',
            'Olá '+this.capitalizeText(this.dadosIdentificacao.nome)+'.\nComo posso ajudar você?',
            'texto'
          )
         
        }
        else
        {
          resLoading.dismiss()
        }
      })
    })
   


   
  }

  
  PrintSend(er:string,por:string,texto:string,tipo:string):Promise<any>
  { 
    return new Promise((resolve,reject)=>{
      //E = entrada
      //R = recebido
      
      const addMesg = {
        createAt:new Date().getTime(),
        tipo,
        mensagem:texto,
        por,
        er

      }
      this.mensagensList.push(addMesg)
      this.content.scrollToBottom(300);
      resolve()
    })  

    
  }



  sendMensagem()
  {
    if(this.mensagemEnviar.length)
    {
      //PROCESSAR NO WATSON
      this.PrintSend(
        'e',
        this.dadosIdentificacao.nome,
        this.mensagemEnviar,
        'texto'
      )
      .then(()=>{
        this.mensagemEnviar = ''
      })
      .catch(err=>{
        this.printLog(err)
      })
    }
    else
    {
      this.printLog('Não existe texto para enviar')
    }
  }


}
