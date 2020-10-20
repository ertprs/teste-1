import { Component, OnInit, Input } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Itempresaconf } from 'src/app/interface/empresa/itempresaconf';
import { ItWppChatapi } from 'src/app/interface/configuracoes/chat/wppchatapi';
import { ItWppTwilio } from 'src/app/interface/configuracoes/chat/wpptwilio';
import { AdministracaoService } from 'src/app/services/administracao/administracao.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Itadminformacoes } from 'src/app/interface/administracao/itadminformacoes';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-comp-administracao-empresadetalhe',
  templateUrl: './comp-administracao-empresadetalhe.component.html',
  styleUrls: ['./comp-administracao-empresadetalhe.component.scss'],
})
export class CompAdministracaoEmpresadetalheComponent implements OnInit {

  @Input() data: any;

  private dadosConfSubscription: Subscription;
  private dadosConf: Itempresaconf = {};

  private dadosConfWppChatapiSubscription: Subscription;
  private dadosConfWppChatapi: ItWppChatapi = {};

  private dadosConfWppTwilioSubscription: Subscription;
  private dadosConfWppTwilio: ItWppTwilio = {};

  public dadosAdministrativos:Itadminformacoes = {}

  

  

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private design : ProcessosService,
    private administracaoService:AdministracaoService,
    private DB:AngularFirestore,
    private afa:AngularFireAuth
  ) { 
    this.dadosConfSubscription = new Subscription;
    this.dadosConfWppChatapiSubscription = new Subscription;
    this.dadosConfWppTwilioSubscription = new Subscription;
  }

  ngOnInit() {
    console.log(this.data);
    this.dadosConfSubscription = this.administracaoService.getEmpresaConf(this.data.empresaUid).subscribe(data => {
      this.dadosConf = data;
     
    });
    this.dadosConfWppChatapiSubscription = this.administracaoService.getConfChats(this.data.empresaUid,'wppchatapi').subscribe(data => {
      if(data.length === 1) this.dadosConfWppChatapi = data[0];
      
    });
    this.dadosConfWppTwilioSubscription = this.administracaoService.getConfChats(this.data.empresaUid,'twilio').subscribe(data => {
      if(data.length === 1) this.dadosConfWppTwilio = data[0];
      
    });

    this.DB.collection('EmpControle',ref => ref.where('empresaUid', '==', this.data.empresaUid)).get().forEach(elem=>{
      console.log('dados Obtidos')
      console.log(elem)
      if(!elem.empty)
      {
        console.log('=========================')
        elem.docs.forEach(dados=>{
          let id = dados.id;
          const retorno = {id,... dados.data() }
          this.dadosAdministrativos = <Itadminformacoes>retorno
          console.log(dados.data())
     
        })
      
      
        
      }
    })
  }
  startEmpresa()
  {
    this.design.presentAlertConfirm(
      'Atenção',
      'Você esta prestes a liberar uma empresa. A partir deste momento a recorrência entrará em vigor e não será possivel reverter.',
      'Quero liberar',
      'Desistir'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.dadosAdministrativos.empresaAtiva = true
        this.dadosAdministrativos.empresaStartDate = new Date().getTime()
        this.dadosAdministrativos.userLiberouNome = this.afa.auth.currentUser.displayName,
        this.dadosAdministrativos.userLiberouUid = this.afa.auth.currentUser.uid

        this.administracaoService.update(this.dadosAdministrativos.id,this.dadosAdministrativos)
        .then(resUpdate=>{
          this.design.presentToast(
            'Empresa foi liberada com sucesso',
            'success',
            3000,
            false
          )
        })
        .catch(err=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao atualizar os dados',
            'danger',
            0,
            true
          )
        })

      }
    })
  }
  atualizarDadosAdm()
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma gravar os dados ?',
      'SIM',
      'Não'
    )
    .then(res=>{
      if(res)
      {
        this.design.presentLoading('Atualizando')
        .then(resLoading=>{
          resLoading.present()
          this.DB.collection('EmpControle').doc(this.dadosAdministrativos.id).update(this.dadosAdministrativos)
          .then(resUpdate=>{
            this.design.presentToast(
              'Atualizado com sucesso',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao atualizar os dados',
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

  ngOnDestroy() {
    this.dadosConfSubscription.unsubscribe();
    this.dadosConfWppChatapiSubscription.unsubscribe();
    this.dadosConfWppTwilioSubscription.unsubscribe();
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  confirmAtualizar(tabela:string) {
    this.design.presentAlertConfirm(`Deseja mesmo atualizar os dados`,`Deseja mesmo atualizar esses dados?`,'Opa!','Não!').then(result => {
      if(result) {
        if(tabela.toUpperCase() === 'CONF') {
          this.atualizarConf();
        } else if(tabela.toUpperCase() === 'WHATSAPP') {
          this.atualizarWhatsapp();
        } else if(tabela.toUpperCase() === 'TWILIO') {
          this.atualizarTwilio();
        
        } else if(tabela.toUpperCase() === 'FACEBOOK') {
          
        }
      } else {
        console.log('NÃO Transmitir');
      }
    });
  }
  admAjustarContatos()
  {

    this.design.presentAlertConfirm(
      'ATENCAO',
      'Você confirma reajustar tabela de contatos. Está ação não poderá ser desfeita e tem como objetivo corrigir os dados de contato para tabela sql',
      'SIM',
      'NÃO'
    ).then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Aguarde...')
        .then(ResLoading=>{
           ResLoading.present()
           this.administracaoService.acaoAdmAdd(this.data.empresaUid,'contatossql')
           .then(resAdd=>{
             let uid = resAdd.id
             console.log('Add acao '+uid)

            this.administracaoService.acaoAdmGetResult(uid).snapshotChanges().subscribe(elem=>{
              const dados = elem.payload.data()
              if(dados["situacao"] == 1)
              {
                ResLoading.dismiss()
                alert('Acao concluida com sucesso')
              }
              if(dados["situacao"] == 2)
              {
                ResLoading.dismiss()
                alert('Erro')
              }
              
              console.log(dados)
            })


           })
        })
       
       
      }
    })
    
  }
  atualizarConf() {
    
    this.dadosConf.qtdSaldo = parseFloat(this.dadosConf.qtdSaldo.toString());
    this.dadosConf.qtdUsuariosLimit = parseFloat(this.dadosConf.qtdUsuariosLimit.toString());
    this.design.presentLoading('Salvando dados...').then(resLoading=>{
      resLoading.present();
      this.administracaoService.updateEmpresaConf(this.data.empresaUid,this.dadosConf).then(res=>{
        this.design.presentToast(
          'Dados atualizados com sucesso',
          'success',
          3000
        );
      }).catch(err=>{
        console.log(err);
        this.design.presentToast(
          'Falha ao atualizar dados',
          'danger',
          4000
        );
      }).finally(() => {
        resLoading.dismiss();
      }) 
    });
  }

  atualizarWhatsapp() {
    
    if(this.dadosConfWppChatapi.id !== undefined) {

      this.design.presentLoading('Salvando dados...').then(resLoading=>{
        resLoading.present();
        this.administracaoService.updateConfChats(this.data.empresaUid,this.dadosConfWppChatapi.id,'wppchatapi', this.dadosConfWppChatapi).then(res=>{
          this.design.presentToast(
            'Dados atualizados com sucesso',
            'success',
            3000
          );
        }).catch(err=>{
          console.log(err);
          this.design.presentToast(
            'Falha ao atualizar dados',
            'danger',
            4000
          );
        }).finally(() => {
          resLoading.dismiss();
        }) 
      });

    } else {

      this.design.presentLoading('Salvando dados...').then(resLoading=>{
        resLoading.present();
        this.administracaoService.addConfChats(this.data.empresaUid,'wppchatapi', this.dadosConfWppChatapi).then(res=>{
          this.design.presentToast(
            'Dados atualizados com sucesso',
            'success',
            3000
          );
        }).catch(err=>{
          console.log(err);
          this.design.presentToast(
            'Falha ao atualizar dados',
            'danger',
            4000
          );
        }).finally(() => {
          resLoading.dismiss();
        }) 
      });

    }
  }

  atualizarTwilio() {
    
    if(this.dadosConfWppTwilio.id !== undefined) {

      this.design.presentLoading('Salvando dados...').then(resLoading=>{
        resLoading.present();
        this.administracaoService.updateConfChats(this.data.empresaUid,this.dadosConfWppTwilio.id,'twilio', this.dadosConfWppTwilio).then(res=>{
          this.design.presentToast(
            'Dados atualizados com sucesso',
            'success',
            3000
          );
        }).catch(err=>{
          console.log(err);
          this.design.presentToast(
            'Falha ao atualizar dados',
            'danger',
            4000
          );
        }).finally(() => {
          resLoading.dismiss();
        }) 
      });

    } else {
      this.design.presentLoading('Salvando dados...').then(resLoading=>{
        resLoading.present();
        this.administracaoService.addConfChats(this.data.empresaUid,'twilio', this.dadosConfWppTwilio).then(res=>{
          this.design.presentToast(
            'Dados atualizados com sucesso',
            'success',
            3000
          );
        }).catch(err=>{
          console.log(err);
          this.design.presentToast(
            'Falha ao atualizar dados',
            'danger',
            4000
          );
        }).finally(() => {
          resLoading.dismiss();
        }) 
      });

    }
    
  }
  
  atualizarFaceBook() {
    
    alert('Atualizar dados facebbok')
    
  }

  public copyForClipboard(event: MouseEvent, input : any): void {
    try {
      event.preventDefault();
      const payload: string = input.data;
  
      let listener = (e: ClipboardEvent) => {
        let clipboard = e.clipboardData || window["clipboardData"];
        clipboard.setData("text", payload.toString());
        e.preventDefault();
      };
  
      document.addEventListener("copy", listener, false)
      document.execCommand("copy");
      document.removeEventListener("copy", listener, false);

      this.design.presentToast( 
        'Copiado com sucesso',
        'success',
        3000
      );

    } 
    catch (error) {
      this.design.presentToast(
        'Falha ao copiar '+error,
        'danger',
        3000
      );
    }
  }

}
