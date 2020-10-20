import { UserService } from 'src/app/services/global/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


import { Itconfusuario } from 'src/app/interface/configuracoes/usuario/itconfusuario';
import { Ittransferencia } from 'src/app/interface/chat/transferencia';

import { ProcessosService } from 'src/app/services/design/processos.service';
import { UsuariosService } from 'src/app/services/seguranca/usuarios.service';
import { TransferenciaService } from 'src/app/services/chat/transferencia.service';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.page.html',
  styleUrls: ['./transferencia.page.scss'],
})
export class TransferenciaPage implements OnInit {

  public usuarios = new Array<Itconfusuario>();
  private itemsUsuarios: Subscription = new Subscription;

  private dadosTransferencia : Ittransferencia = {};

  private currentUser:any = {};
  private conversaUid:string = '';
  private origemChamada:string = '';
  private contatoUid:string= '';

  constructor(
    private design:ProcessosService,
    private usuariosService:UsuariosService,
    private globalService:UserService,
    private nav:NavParams,
    private modal:ModalController,
    private router:Router,
    private afa:AngularFireAuth,
    private serviceTransferencia:TransferenciaService,
    private conversasService:ConversasService,
    private eventEmitterService: ProvEmitterEventService,

  ) { 
    this.currentUser = this.nav.get('currentUser');
    this.conversaUid = this.nav.get('conversaUid');
    this.origemChamada = this.nav.get('origemChamada');
    this.contatoUid = this.nav.get('contatoUid')
  
  }

  ngOnInit() {
    this.itemsUsuarios = this.usuariosService.getUserEmpresaAll().subscribe(data=>{     
      
      if(this.origemChamada == 'mensagens')
      {
        this.usuarios = data.filter(item => item.userUid !== this.currentUser.uid);
      }
      else
      {
        this.usuarios = data;
      }
     
      // 
    })
    this.dadosTransferencia.motivo = '';
  }
  ngOnDestroy(){
    this.itemsUsuarios.unsubscribe();
  }
  RemoverConversaLista(convarsaUid:string)
  {
    let checkConversa = this.globalService.conversas.reduce( function( cur, val, index ){

      if( val.id === convarsaUid && cur === -1 ) {
              return index;
          }
          return cur;
      
      }, -1 );
      if(checkConversa >-1)
      {
        this.globalService.conversas.splice(checkConversa,1);
      }
  }
  chatTransferir()
  {
    const arr = this.usuarios.filter(item => this.dadosTransferencia.usuarioDestinoUid === item.userUid);
    let destUsuarioUid    = arr[0].userUid;
    let destUsuarioNome   =  arr[0].userNome;

    this.design.presentLoading('Transferindo...')
    .then(resLoading=>{
      resLoading.present()
      this.conversasService.TransferirConversaEnviar(this.conversaUid, this.dadosTransferencia.motivo,this.contatoUid,destUsuarioUid,destUsuarioNome,false)
      .then(dados=>{
      //REMOVER DA LISTA De CONVERSAS ATIVAS
        this.RemoverConversaLista(this.conversaUid);

        
        this.modal.dismiss();
        if(this.origemChamada === 'mensagens') {
          this.functionExecute('btnBack',{componente:'home'});
        }
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Falha ao iniciar processo de transferencia',
          'danger',
          0,
          true
        )
      })
      .finally(()=>{
        resLoading.dismiss()
      })
    })
    .catch(err=>{
      console.log(err);
      console.log(err)
      this.design.presentToast(
        'Fatal error',
        'danger',
        0,
        true
      )
    })
    

  }
  //VELHA 
  async chatTransferir2() {
    try {
      await this.design.presentLoading('Transferindo').then( resloading => {
        resloading.present();
        if(!this.dadosTransferencia.hasOwnProperty('motivo')) {
          this.dadosTransferencia.motivo = '';
        }
        const arr = this.usuarios.filter(item => this.dadosTransferencia.usuarioDestinoUid === item.userUid);
        this.dadosTransferencia.usuarioDestinoNome = arr[0].userNome;
        this.dadosTransferencia.usuarioOrigemUid = this.afa.auth.currentUser.uid;
        this.dadosTransferencia.usuarioOrigemNome = this.afa.auth.currentUser.displayName;
        this.dadosTransferencia.conversaUid = this.conversaUid;
        console.log(this.dadosTransferencia);

        this.serviceTransferencia.add(this.dadosTransferencia).then((res)=>{
          console.log(res.id);
          this.conversasService.updateTransferencia(this.conversaUid,{situacao:3,transferenciaUid:res.id}).then((res2)=>{
            resloading.dismiss();

            //REMOVER DA LISTA
           // this.RemoverConversaLista(this.conversaUid);


            this.design.presentToast(
              'Transferência enviada',
              'success',
              3000
            );
            this.modal.dismiss();
            if(this.origemChamada === 'mensagens') {
              this.functionExecute('btnBack',{componente:'home'});
            }
            
          }).catch((err)=>{
            console.log(err)
            resloading.dismiss();
            this.design.presentToast(
              'Falha ao enviar transferência (1)',
              'danger',
              4000
            );
          });
        }).catch((err)=>{
          console.log(err)
          resloading.dismiss();
          this.design.presentToast(
            'Falha ao enviar transferência (2)',
            'danger',
            4000
          );
        });
      });
    } catch(err) {
      console.log(err);
      this.design.presentToast(
        "Falha ao tentar enviar transferência (3)",
        "danger",
        4000
      )
    }
  }
  closeModal() {
  console.log('Close modal')
    this.modal.dismiss();
  }
  functionExecute(functionName:string,params:any) {
    console.log('preparando '+functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
}
