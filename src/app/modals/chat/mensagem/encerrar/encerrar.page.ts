import { Contatos } from 'src/app/interface/chat/contatos';
import { ContatosService } from './../../../../services/chat/contatos.service';
import { ProcessosService } from './../../../../services/design/processos.service';
import { UserService } from 'src/app/services/global/user.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavParams, AlertController, PopoverController, ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Conversas } from 'src/app/interface/chat/conversas';


@Component({
  selector: 'app-encerrar',
  templateUrl: './encerrar.page.html',
  styleUrls: ['./encerrar.page.scss'],
})
export class EncerrarPage implements OnInit {


  public dadosConversa: Conversas = {};
  private dadosContato: Contatos = {}
  private currentUser:any;
  private conversaUid:any;
  private contatoUid: string = '';
  private valor: number = 0.00;
  private interesse: number = 0;

  public qtdProdutosVisitados:number =0;
  public ProdutosVisitados:any[] = []

  constructor(
    private conversasService: ConversasService,
    private modal:ModalController,
    private nav:NavParams,
    private router:Router,
    private eventEmitterService: ProvEmitterEventService,
    private srvGlobal:UserService,
    private design:ProcessosService,
    private srvContato:ContatosService
  ) {
    this.conversaUid = this.nav.get('conversaUid');
    this.currentUser = this.nav.get('currentUser');
    this.contatoUid = this.nav.get('contatoUid');
    this.dadosConversa = this.nav.get('dadosConversa');
    console.log(this.dadosConversa)
  }
  closeModal(){
    this.modal.dismiss();
  }

  RemoverConversaLista(convarsaUid:string)
  {
    let checkConversa = this.srvGlobal.conversas.reduce( function( cur, val, index ){

      if( val.id === convarsaUid && cur === -1 ) {
              return index;
          }
          return cur;
      
      }, -1 );
      if(checkConversa >-1)
      {
        this.srvGlobal.conversas.splice(checkConversa,1);
      }
  }

  functionExecute(functionName:string,params:any)
  {
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  ngOnInit() {

    if(this.dadosConversa.produtosVisitados !== undefined)
    {
      this.qtdProdutosVisitados = this.dadosConversa.produtosVisitados.length;
      if( this.dadosConversa.produtosVisitados.length > 0)
      {
        
        this.dadosConversa.produtosVisitados.forEach(dados=>{
          this.ProdutosVisitados.push(dados)
          
        })
      }
    }
  }
  chatEncerrar()
  {
    let validado = true;
    if(this.dadosConversa.intencao.toUpperCase() == 'COMERCIAL')
    {
      
      if(this.dadosConversa.conversao == 1)
      {
        if(!this.dadosConversa.comercialUidOrcamento || this.dadosConversa.comercialUidOrcamento == '')
        {
          validado = false
          this.design.presentToast(
            'Antes de encerrar esta conversa é necessário criar orçamento/pedido',
            'secondary',
            0,
            true
          )
        }
        
      }
    
    }
    else
    {
      console.log('Outras validações')
    }

    if(validado)
    {
      this.design.presentLoading('Encerrando...')
      .then(resLoading=>{
        resLoading.present();
        this.dadosConversa.situacao = 6; //situacao de finalizado
        console.log(this.dadosConversa)

        this.conversasService.update(this.conversaUid ,this.dadosConversa)
        .then(resEncerramento=>{
          this.dadosContato.situacao = 1;
          this.srvContato.liberarContato(this.dadosConversa.contatoUid,this.dadosContato)
          .then(resFinalizaContato=>{
            this.design.presentToast(
              'Conversa encerrada com sucesso',
              'success',
              3000
            )
            this.modal.dismiss()
            this.functionExecute('btnBack',{componente:'home'})
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao liberar contato',
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
          this.design.presentToast(
            'Falha ao atualizar informações de encerramento',
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
        this.design.presentToast(
          'Falha ao tentar encerrar esta conversa',
          'danger',
          0,
          true
        )
      })

    }
  }
  chatEncerrar3()
  {
    this.design.presentLoading('Encerrando...')
    .then(resLoading=>{
      resLoading.present();
      this.dadosConversa.situacao = 6; //situacao de finalizado
      console.log(this.dadosConversa)

      this.conversasService.update(this.conversaUid ,this.dadosConversa)
      .then(resEncerramento=>{
        this.dadosContato.situacao = 1;
        this.srvContato.liberarContato(this.dadosConversa.contatoUid,this.dadosContato)
        .then(resFinalizaContato=>{
          this.design.presentToast(
            'Conversa encerrada com sucesso',
            'success',
            3000
          )
          this.modal.dismiss()
          this.functionExecute('btnBack',{componente:'home'})
        })
        .catch(err=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao liberar contato',
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
        this.design.presentToast(
          'Falha ao atualizar informações de encerramento',
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
      this.design.presentToast(
        'Falha ao tentar encerrar esta conversa',
        'danger',
        0,
        true
      )
    })
  }
  chatEncerrar2() {
    try {

      this.design.presentLoading('Finalizando...')
      .then(resLoading=>{
        resLoading.present();
        const updateData:any = {valor:parseFloat(this.valor.toString()),interesse:Number(this.interesse),situacao:6};
        if(this.interesse === 1 || this.interesse === 2) updateData.intencao === "COMERCIAL";

        this.conversasService.endChat(this.contatoUid,this.conversaUid,updateData)
        .then(ret=>{
          this.RemoverConversaLista(this.conversaUid)
        })
        .catch(err=>{
          this.design.presentToast(
            'Falha ao encerrar chamada',
            'danger',
            0,
            true
          )
        })
        .finally(()=>{
          resLoading.dismiss();
          this.modal.dismiss()
          .then(res=>{
            this.functionExecute('btnBack',{componente:'home'})
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha no processo de fechamento do modal',
              'warning',
              2000
            )
          })

          
        })
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Erro ao processar sua solicitação',
          'danger',
          2000
        )
      })

      
      
      
      
    
    } catch(err) {
      console.log(err)
      this.design.presentToast(
        'Fatal Error',
        'danger',
        0,
        true
      )
      return {situacao:'err',code:0,msg:'endChat err:'+err.message};   
    }
  }

}
