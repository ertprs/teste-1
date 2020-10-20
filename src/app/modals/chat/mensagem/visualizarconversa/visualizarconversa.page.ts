import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { ModalController, IonContent } from '@ionic/angular';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Mensagens } from 'src/app/interface/chat/mensagens';
import { Subscription } from 'rxjs';
import { Conversas } from 'src/app/interface/chat/conversas';

@Component({
  selector: 'app-visualizarconversa',
  templateUrl: './visualizarconversa.page.html',
  styleUrls: ['./visualizarconversa.page.scss'],
})
export class VisualizarconversaPage implements OnInit {

  @ViewChild(IonContent, {static: false}) content: IonContent;
  @Input() dadosConversa: Conversas;
 
  public mensagemSubscribe: Subscription;
  public mensagem = new Array<Mensagens>();
  public mensagemfilter = new Array<Mensagens>();


  public contatoUid:string;
  public conversaUid:string;
  private transferencia : boolean = false;

  constructor(
    private ctrlModel:ModalController,
    private srvConversas:ConversasService,
    private srvmensagens:MensagensService,
    private design:ProcessosService

  ) { }

  ngOnInit() {

    this.transferencia = false;

    if(this.dadosConversa)
    {
      this.contatoUid = this.dadosConversa.contatoUid
      
      
      this.design.presentLoading('Aguarde...')
      .then(resLoading=>{
        resLoading.present();
        console.log('listar conversas de ')
        console.log(JSON.stringify(this.dadosConversa))
        this.mensagemSubscribe = this.srvmensagens.getMensagens(this.contatoUid).subscribe(data=>{
          

          data.sort(function(a,b) {
            return a.createAt < b.createAt ? -1 : a.createAt > b.createAt ? 1 : 0;
          }).forEach(mensagemRecebida=>{

            let checkMensagem = this.mensagem.reduce( function( cur, val, index ){

              if( val.uid === mensagemRecebida.uid && cur === -1 ) {
                  
                return index;
              }
              return cur;
          
            }, -1 );

            if(checkMensagem >-1)
            {
              //EXISTE
              this.mensagem[checkMensagem].entregueTag = mensagemRecebida.entregueTag;
              this.mensagem[checkMensagem].anexo = mensagemRecebida.anexo
              this.mensagem[checkMensagem].tipo = mensagemRecebida.tipo

            }
            else
            {
              //NAO EXISTE
              this.mensagem.push(mensagemRecebida)

              setTimeout(()=>{
                
                this.content.scrollToBottom(300);
              },200); 
            }
  


          })
        })
        resLoading.dismiss();

      })
      

    }
    else
    {
      this.design.presentToast(
        'Não foi identificado dados de conversa',
        'warning',
        0,
        true
      )
    }
    


  }

  startTransferencia(){
    this.transferencia = true;

    this.ctrlModel.dismiss({
      action: 'abrirModalTransf',
      dadosConversa: this.dadosConversa
    });
  }

  closeModal()
  {
    this.ctrlModel.dismiss();
  }

}
