import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import { HomeGrupoPage } from 'src/app/modals/grupos/home-grupo/home-grupo.page';
import { ConsultaPage } from 'src/app/modals/parceiros/consulta/consulta.page';

import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { UserService } from 'src/app/services/global/user.service';

@Component({
  selector: 'app-compchatcontatoedit',
  templateUrl: './compchatcontatoedit.page.html',
  styleUrls: ['./compchatcontatoedit.page.scss'],
})
export class CompchatcontatoeditPage implements OnInit {

  @Input() data:any

  private dadosContato = {
    nome:'',
    cargo:'',
    origem_email:'',
    origem_wpp:'',
    origem_1:'',
    origem_facebook:'',
    origem_telegram:'',
    notas:'',
    parceiroUid:'',
    parceiroNome:'',
    usuarioNome:'',
    usuarioUid:'',
    persona:'',
    grupo:'',
    grupoUid:'',
    subGrupo:'',
    subGrupoUid:'',
    live:2,
    favorito:2,
    sincronizado:0,
    kyc:false
  }
  private contatoUid:string = ''
  private libDelete:boolean = false
  private permissaoUser:any;
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvContato : ContatosService,
    private design:ProcessosService,
    private afa:AngularFireAuth,
    private globalUser:UserService,
    private ctrlModal:ModalController

  ) { 
    
  }

  ngOnInit( ) {
    
    if(this.data.contatoUid)
    {
      this.contatoUid = this.data.contatoUid
      this.abrirDados(this.contatoUid)
   
    }
    
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

  delete(contatoUid:string)
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma excluir este contato?',
      'Opa!',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Excluindo...')
        .then(resLoading=>{
          resLoading.present()
          this.srvContato.contatoDelete(this.contatoUid)
          .then(resDelete=>{
            this.design.presentToast(
              'Excluido com sucesso',
              'success',
              3000,
              
            )
            this.functionExecute('chatContatoHome',{limpardados:true})
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Houve um problema ao tentar excluir contato. Entre em contato com o suporte técnico',
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
  abrirDados(contatoUid:string)
  {
    this.design.presentLoading('Aguarde...')
    .then(resLoading=>{
      resLoading.present()
      this.permissaoUser = this.globalUser.dadosLogado.configUser
      if(this.permissaoUser.administracao && this.permissaoUser.supervisao)
      {
        this.libDelete = true
      }
      else if (this.dadosContato.usuarioUid == this.afa.auth.currentUser.uid)
      {
        this.libDelete = true;
      }
      else
      {
        this.libDelete = false;
      }
      this.srvContato.contatoGetDetalhe(contatoUid)
      .then(res=>{
        res.subscribe(dados=>{
          if(dados.exists)
          {
            this.dadosContato = <any> dados.data()
          }
          else
          {
            console.log('falha ao abrir o contato '+contatoUid)
            this.design.presentToast(
              'Houve um problema ao tentar abrir os dados do contato. Entre em contato com o suporte técnico',
              'danger',
              0,
              true
            )
            this.functionExecute('chatContatoHome',{limpardados:true})
          }
        })
      })
      .catch(err=>{
        console.log(err)
        console.log('falha ao abrir o contato '+contatoUid)
        this.design.presentToast(
          'Houve um problema ao tentar abrir os dados do contato. Entre em contato com o suporte técnico',
          'danger',
          0,
          true
        )
        this.functionExecute('chatContatoHome',{limpardados:true})
      })
      .finally(()=>{
        resLoading.dismiss()
      })
    })
    
    
    
   
  }
  async abrirConsultaGrupo(origem)
  {
  

    const modal = await this.ctrlModal.create({
      component: HomeGrupoPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        origem
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
       if(dados.data.origem == 'grupo')
       {
         this.dadosContato.grupo = dados.data.nome
         this.dadosContato.grupoUid = dados.data.uid
       }
       else if(dados.data.origem == 'subgrupo')
       {
         this.dadosContato.subGrupo = dados.data.nome
         this.dadosContato.subGrupoUid = dados.data.uid
       }
       else
       {
         console.log('origem nao foi definida ')
       }
        
      }
    })

    await modal.present();
  }
  async AbrirConsultaParceiros()
  {
  

    const modal = await this.ctrlModal.create({
      component: ConsultaPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        origem:'contato'
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        const dadosRecebidos = dados.data.dados

        this.dadosContato.parceiroNome = dadosRecebidos.razaoSocial,
        this.dadosContato.parceiroUid = dadosRecebidos.uid

      }
    })

    await modal.present();
  }
  gravar()
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma gravar essas informações?',
      'Claro',
      'Melhor não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {


        if(this.dadosContato.sincronizado === undefined)
        {
          this.design.presentLoading('Gravando...')
          .then(resLoading=>{
            resLoading.present()
            this.srvContato.contatoCheck(this.dadosContato).subscribe(dados=>{
              console.log(dados)
              if(dados.situacao == 'suc')
              {
                const dataReturn = dados.data.data[0]
                if(dataReturn.length == 0)
                {
                  this.srvContato.contatoAdd(this.dadosContato)
                  .then(resAdd=>{
                    this.contatoUid = resAdd
                    this.libDelete = true;
                  })
                  .catch(err=>{
                    this.design.presentToast(
                      'Ops! Algo deu errado. Tente novamente mais tarde',
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
                  resLoading.dismiss()
                  //ATUALIZAR CADASTRO
                  this.dadosContato.sincronizado = 1
                  this.design.presentLoading('Atualizando...')
                  .then(resLoading=>{
                    resLoading.present()
                    this.srvContato.contatoAtualizar(this.contatoUid,this.dadosContato)
                    .then(()=>{
                      this.design.presentToast(
                        'Atualizado com sucesso',
                        'success',
                        3000
                      )
                    })
                    .catch(err=>{
                      console.log(err)
                      this.design.presentToast(
                        'Falha ao atualizar dados',
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
              }
              else
              {
                resLoading.dismiss()
                this.design.presentToast(
                  'Falha ao gravar contato. Tente novamente mais tarde',
                  'danger',
                  0,
                  true
                )
              }
            })
          })

        }
        else
        {
          if(this.contatoUid)
          {
          
            
  
  
            this.design.presentLoading('Atualizando...')
            .then(resLoading=>{
              resLoading.present()
              this.srvContato.contatoAtualizar(this.contatoUid,this.dadosContato)
              .then(()=>{
                this.design.presentToast(
                  'Atualizado com sucesso',
                  'success',
                  3000
                )
              })
              .catch(err=>{
                console.log(err)
                this.design.presentToast(
                  'Falha ao atualizar dados',
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
          else
          {
          
            this.design.presentLoading('Gravando...')
            .then(resLoading=>{
              resLoading.present()
              this.srvContato.contatoCheck(this.dadosContato).subscribe(dados=>{
                console.log(dados)
                if(dados.situacao == 'suc')
                {
                  const dataReturn = dados.data.data[0]
                  if(dataReturn.length == 0)
                  {
                    this.srvContato.contatoAdd(this.dadosContato)
                    .then(resAdd=>{
                      this.contatoUid = resAdd
                      this.libDelete = true;
                    })
                    .catch(err=>{
                      this.design.presentToast(
                        'Ops! Algo deu errado. Tente novamente mais tarde',
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
                    resLoading.dismiss()
                    this.design.presentToast(
                      'Já existe um cadastro com os dados informados',
                      'warning',
                      0,
                      true
                    )
                  }
                }
                else
                {
                  resLoading.dismiss()
                  this.design.presentToast(
                    'Falha ao gravar contato. Tente novamente mais tarde',
                    'danger',
                    0,
                    true
                  )
                }
              })
            })
  
          }
        }
       
      }
    })
    
  }
}
