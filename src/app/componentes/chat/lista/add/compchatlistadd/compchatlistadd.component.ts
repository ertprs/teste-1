import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AnexosPage } from 'src/app/modals/chat/anexos/anexos.page';
import { ModalchatlistarelPage } from 'src/app/modals/chat/listatransmissao/relatorios/modalchatlistarel/modalchatlistarel.page';
import { HomeGrupoPage } from 'src/app/modals/grupos/home-grupo/home-grupo.page';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-compchatlistadd',
  templateUrl: './compchatlistadd.component.html',
  styleUrls: ['./compchatlistadd.component.scss'],
})
export class CompchatlistaddComponent implements OnInit {

  @Input() data : any;


  private grupos = []
  private itemsEnvio = []
  private subGrupos = []
  private listaUid:string
  private dadosTransmissao = {
    nome:'',
    mensagem:'',
    anexo:'',
    grupo:'',
    subGrupo:'',
    situacaoNome:'Digitando',
    createAt: new Date().getTime(),
    usuarioNome:'',
    qtdEnviado:0,
    situacao:0
  }
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private design:ProcessosService,
    private srvContatos:ContatosService,
    private ctrlModal:ModalController
  ) { }

  ngOnInit() {

    //this.carregarGrupos()
   if(this.data.uid)
   {
     this.listaUid = this.data.uid
      this.abrirDadosLista(this.listaUid)

    
   }
  }
  abrirDadosLista(listaUid)
  {
    this.srvContatos.listaTransmissaoGet(listaUid).forEach(elem=>{
      const data = elem.data()
      this.dadosTransmissao = <any>data
    })
    this.srvContatos.listaTransmissaoDetalheGetAll(this.listaUid).forEach(dados=>{
      this.itemsEnvio = dados
     })
  }
  async abrirDetLead(transmissaoUid:string) {
    const modal = await this.ctrlModal.create({
      component: ModalchatlistarelPage,
      componentProps: {
        transmissaoUid
      },
      cssClass: 'selector-modal'
    });
    return await modal.present();
  }
  abortarTransmissao(transmissaoUid:string)
  {

    this.design.presentAlertConfirm(
      'Atenção',
      'Você confirma parar esta transmissão?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Cancelando transmissão...')
        .then(resLoading=>{
          resLoading.present()
          this.srvContatos.transmissaoAbortar(this.listaUid,transmissaoUid)
          .then(()=>{
            this.design.presentToast(
              'Transmissão cancelada com sucesso',
              'success',
              4000
            )
              this.abrirDadosLista(this.listaUid)
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao tentar cancelar transmissão',
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
  enviarLista()
  {
    if(this.dadosTransmissao.situacao != 0)
    {
      return this.design.presentToast(
        'A lista não esta em um processo autorizado para envio ('+this.dadosTransmissao.situacao+') ',
        'warning',
        0,
        true
      )
    }
    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma enviar lista de transmissão?',
      'Pode mandar!',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Preparando lista, aguarde...')
        .then(resLoading=>{
          resLoading.present()
          this.srvContatos.listaPrepararEnvio(this.listaUid, this.dadosTransmissao)
          .then(resPrep=>{
        
            this.abrirDadosLista(this.listaUid)
            this.design.presentToast(
              'A lista foi preparada com sucesso.',
              'success',
              3000

            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao preparar lista',
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
  async uploadDesk(){
    const modal = await this.ctrlModal.create({
      component: AnexosPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        origemChamada: 'listatransmissao'
      }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        if(data.data.link !== undefined) {
          this.dadosTransmissao.anexo = data.data.link;
        }
      }
    });

    await modal.present();
  }

  async carregarGrupos()
  {
    
    this.design.presentLoading('Carregando grupos...')
    .then(resLoading=>{
      resLoading.present()
      this.srvContatos.gruposList().subscribe(async (res:any) => {
        resLoading.dismiss()
        const data  = res.data.data[0]
        console.log(data)
        this.grupos = data
        this.subGrupos = data
      
      }).unsubscribe()
    })
    
    
  }

  async gravarLista()
  {
    this.design.presentAlertConfirm(
      'Gravar',
      'Confirma gravar esta lista?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Cadastrando, aguarde...')
        .then(resLoading=>{
          resLoading.present()
          this.srvContatos.listaTransmicaoAdd(this.dadosTransmissao)
          .then(res=>{
            this.listaUid = res.id
            console.log(this.listaUid)
            this.design.presentToast(
              'Lista gerada com sucesso',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao gerar lista',
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
         this.dadosTransmissao.grupo = dados.data.nome
       }
       else if(dados.data.origem == 'subgrupo')
       {
        this.dadosTransmissao.subGrupo = dados.data.nome
       }
       else
       {
         console.log('origem nao foi definida ')
       }
        
      }
    })

    await modal.present();
  }

}
