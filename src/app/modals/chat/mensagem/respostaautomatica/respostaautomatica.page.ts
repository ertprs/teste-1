import { ConversasService } from 'src/app/services/chat/conversas.service';
import { Component, Input, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { AprendizadoService } from 'src/app/services/lara/aprendizado.service';
import { Aprendizado } from 'src/app/interface/lara/aprendizado';

import { Exemploia } from 'src/app/interface/lara/aprendizado/exemploia';
import { Mensagens } from 'src/app/interface/chat/mensagens';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-respostaautomatica',
  templateUrl: './respostaautomatica.page.html',
  styleUrls: ['./respostaautomatica.page.scss'],
})
export class RespostaautomaticaPage implements OnInit {


  @Input() dadosConversa: any;

  private currentUser:any = {};
  private dadosMensagem:any = {};
  
  private filtered = new Array<Aprendizado>();
  private aprendizados = new Array<Aprendizado>();
  private aprendizadosSubscription: Subscription = new Subscription;

  private exemploData: Exemploia = {};
  private mensagemData: Mensagens = {};

  private queryText : string = '';

  constructor(
    private mensagensService: MensagensService, 
    private design:ProcessosService,
    private modal:ModalController,
    private serviceAprendizado:AprendizadoService,
    private srvConversas:ConversasService,
    private nav:NavParams,
  ) { }
  closeModal(){
    this.modal.dismiss();
  }
  ngOnInit() {
    this.currentUser = this.nav.get('currentUser');
    this.dadosMensagem = this.nav.get('dadosMensagem');

    this.aprendizadosSubscription = this.serviceAprendizado.getAll().subscribe(data=>{
      this.aprendizados = data;
      this.filtered = this.aprendizados;
    });

  }

  ngOnDestroy() {
    this.aprendizadosSubscription.unsubscribe();
  }

  aprendizadoSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.aprendizados;
    } else {
      const filter = this.queryText.toUpperCase();

      this.filtered = this.aprendizados.filter((item) => {
        for (let i = 0; i < item.titulo.length; i++) {
          const titulo = item.titulo;
          const resposta = item.resposta;
        
          if (titulo.toUpperCase().indexOf(filter) > -1 || resposta.toUpperCase().indexOf(filter) > -1 ) {
            return item;
          }
        }
      })
    }
  }

  async sendResposta(aprendizadoData:Aprendizado) {
    try {

      

      if(this.dadosConversa)
      {
        const dadosRecuperados = this.dadosConversa
        this.design.presentLoading('Enviando ...')
        .then(resLoading=>{
          resLoading.present()

          const conversaUid = dadosRecuperados.conversaUid
  
          this.mensagemData.canal = dadosRecuperados.canal;
          this.mensagemData.contatoNome = dadosRecuperados.contatoNome;
          this.mensagemData.contatoOrigem = dadosRecuperados.contatoOrigem;
          this.mensagemData.contatoUid = dadosRecuperados.contatoUid;
          this.mensagemData.citacao = '';
          this.mensagemData.legenda = '';
          this.mensagemData.anexo = '';
          this.mensagemData.tipo = 'texto';
          this.mensagemData.mensagem = aprendizadoData.resposta;
          this.mensagensService.SendMesg(conversaUid,this.mensagemData)
          .then(resSend1=>{
            

            if(aprendizadoData.anexo !== undefined)
            {
              this.mensagemData.tipo = 'anexo';
              this.mensagemData.anexo = aprendizadoData.anexo;
              this.mensagensService.SendMesg(conversaUid,this.mensagemData)
              .then(resSend2=>{

              })
              .catch(errSend2=>{
                console.log(errSend2)
              })
              .finally(()=>{
                resLoading.dismiss();
                this.modal.dismiss();
              })
            }
            else
            {
              resLoading.dismiss();
              this.modal.dismiss();
            }


          })
          .catch(errSend1=>{
            console.log(errSend1)
            resLoading.dismiss()
          })
          




        })
      }
      else if(this.dadosMensagem)
      {

      

        await this.design.presentLoading('Enviando Resposta').then( resloading => {
          resloading.present();
  
          const exemplo = this.dadosMensagem.mensagem;
          const aprendizadoId = aprendizadoData["id"];
  
          const conversaUid = this.dadosMensagem.conversaUid;
  
          this.mensagemData.canal = this.dadosMensagem.canal;
          this.mensagemData.contatoNome = this.dadosMensagem.contatoNome;
          this.mensagemData.contatoOrigem = this.dadosMensagem.contatoOrigem;
          this.mensagemData.contatoUid = this.dadosMensagem.contatoUid;
          this.mensagemData.citacao = '';
          this.mensagemData.legenda = '';
          this.mensagemData.anexo = '';
          this.mensagemData.tipo = 'texto';
          this.mensagemData.mensagem = aprendizadoData.resposta;
          
  
          console.log('INFO');
          console.log(this.mensagemData);
          this.mensagensService.SendMesg(conversaUid,this.mensagemData)
          .then((res)=>
          {
            if(res)
            {
              
              




              
  
              this.srvConversas.update(conversaUid,{intencao:aprendizadoData.tipo.toUpperCase()})
              .then(resUpdadeConversa=>{
  
                if(aprendizadoData.autoaprendizado)
                {
                  console.log('Treinamento criado')
                  //ENSINAR 
                  this.exemploData.createAt = new Date().getTime(),
                  this.exemploData.exemplo = exemplo;
                  const add = this.serviceAprendizado.addExemplo(aprendizadoId,this.exemploData);
                  add.then((res)=>{
                    this.design.presentToast(
                      'Aprendizado acionado',
                      'secondary',
                      2000
                    )
                    resloading.dismiss();
                    this.modal.dismiss();
                  })
                  .catch((err)=>{
                    resloading.dismiss();
                    console.log(err)
                    this.design.presentToast(
                      "Falha ao realizar aprendizado ",
                      "danger",
                      4000
                    )
                  })
                }
                else
                {
                  resloading.dismiss();
                  this.modal.dismiss();
                }
  
              })
              .catch(err=>{
                console.log(err)
                this.design.presentToast(
                  'Falha ao atualizar informações da conversa',
                  'danger',
                  0,
                  true
                )
              })
              .finally(()=>{
                resloading.dismiss();
                this.modal.dismiss();
              })
  
              
              
            } else {
              resloading.dismiss();
              this.design.presentToast(
                "Falha ao preparar envio da resposta ",
                "danger",
                4000
              )
            }
            
          }).catch((err) => 
          {
            resloading.dismiss();
            console.log(err)
            this.design.presentToast(
              "Falha ao inserir mensagem",
              "danger",
              4000
            )
          });
        });
      }
      else
      {
        alert('Item selecionado')
      }

      
    } catch(err) {
      console.log(err);
      this.design.presentToast(
        "Falha ao enviar resposta",
        "danger",
        4000
      )
    }
  }

}
