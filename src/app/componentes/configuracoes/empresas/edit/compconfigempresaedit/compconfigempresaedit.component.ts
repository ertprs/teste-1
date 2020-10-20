import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalapoioconsultacidadePage } from 'src/app/modals/apoio/parceiros/modalapoioconsultacidade/modalapoioconsultacidade.page';
import { AnexosPage } from 'src/app/modals/chat/anexos/anexos.page';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ServempresaService } from 'src/app/services/empresa/servempresa.service';
import { UserService } from 'src/app/services/global/user.service';

@Component({
  selector: 'app-compconfigempresaedit',
  templateUrl: './compconfigempresaedit.component.html',
  styleUrls: ['./compconfigempresaedit.component.scss'],
})
export class CompconfigempresaeditComponent implements OnInit {

  private dadosEmpresa = {
   
    cnpj:'',
    certificado:{
      arquivo:'',
      senha:''
    },
    razaoSocial:'',
    nomeFantasia:'',
    inscricaoEstadual:'',
    inscricaoMunicipal:'',
    optanteSimplesNacional:false,
    email:'',
    telefoneComercial:'',
    regimeEspecialTributacao:"0",
    endereco:{
      uf:"",
      cidade:"",
      logradouro:"",
      numero:"",
      complemento:"",
      bairro:"",
      cep:"",
      codigoIbgeUf:"35",
      codigoIbgeCidade:"",
      pais:"BRASIL"
    },
    emissaoNFeProduto:{
      ambienteProducao:{
      sequencialNFe:0,
      serieNFe:"1",
      sequencialLoteNFe:1
      },
      ambienteHomologacao:{
        sequencialNFe:1,
        serieNFe:"1",
        sequencialLoteNFe:1
      }
   }

  }
  private UFs = []
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private design:ProcessosService,
    private srvEmpresa:ServempresaService,
    private global:UserService,
    private ctrlModal:ModalController
  ) { }

  ngOnInit() {

    


    this.design.presentLoading('Carregando dados, aguarde...')
    .then(resLoading=>{
      this.UFs = this.global.UFs
      resLoading.present()

      this.srvEmpresa.getConfiguracoes().subscribe(element=>{
        resLoading.dismiss()

        if(element.exists)
        {
          const data = element.data()
          if(data.endereco !== undefined)
          {
            this.dadosEmpresa = <any> element.data()
        
            //console.log(JSON.stringify( this.dadosEmpresa))
          }
         
          
        }
        else
        {
          this.design.presentToast(
            'Falha ao abrir dados da empresa. Entre em contato com suporte técnico',
            'danger',
            0,
            true
          )
          this.functionExecute('compConfiguracoesHome',{})
        }
      })
      

    })
  }
  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  limparCampo(event:any,apenas:any)
  {
    
    if(apenas === 'number')
    {
      event.target.value = event.target.value.replace(/[^0-9]*/g, '');
    }
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
        origemChamada: 'configempresacertificado'
      }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        if(data.data.link !== undefined) {
          this.dadosEmpresa.certificado.arquivo = data.data.link;
        }
      }
    });

    await modal.present();
  }
  gravar()
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma gravar os dados de configuração da empresa?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Gravando...')
        .then(resLoading=>{
          resLoading.present()

          this.srvEmpresa.gravarConfiguracoes(this.dadosEmpresa)
          .then(resUpdate=>{

            //PROCESSAR ENOTAS
            this.srvEmpresa.processarEmpresaEnotas()
            .subscribe(dadosRes=>{
              resLoading.dismiss()
              if(dadosRes.situacao == 'suc')
              {
                const data = dadosRes.data
                if(data.empresaId)
                {
                  //ATUALIZAR enotasKEY 
                  this.srvEmpresa.gravarConfiguracoesTokenEnotas(data.empresaId)
                  .then(()=>{
                    this.design.presentToast(
                      'Configurado com sucesso',
                      'success',
                      3000
                    )
                  })
                  .catch(errTooken=>{
                    console.log(errTooken)
                    this.design.presentToast(
                      'Problema ao setar token. Entre em contato com suporte técnico',
                      'danger',
                      0,
                      true
                    )
                  })
                }
                else
                {
                  console.log(dadosRes)
                  this.design.presentToast(
                    'Houve um problema ao tengar gravar suas configurações (2), entre em contato com suporte técnico caso o problema continue',
                    'danger',
                    0,
                    true
                  )
                }
              }
              else

              {
                console.log(dadosRes)
                this.design.presentToast(
                  'Houve um problema ao tengar gravar suas configurações, entre em contato com suporte técnico caso o problema continue',
                  'danger',
                  0,
                  true
                )
              }
              
            })
            

            
          })
          .catch(errUpdate=>{
            resLoading.dismiss()
            console.log(errUpdate)
            this.design.presentToast(
              'Falha ao gravar configurações',
              'danger',
              0,
              true
            )
          })
          
        })
      }

    })
  }
  limparCidades(){
    this.dadosEmpresa.endereco.codigoIbgeCidade =  ''
    this.dadosEmpresa.endereco.cidade = ''
  }
  async abrirConsultaCidade()
  {
    const uf = this.dadosEmpresa.endereco.uf

    if(uf.length == 2 )
    {
     
        const modal = await this.ctrlModal.create({
          component: ModalapoioconsultacidadePage,
          cssClass: 'selector-modal',
          componentProps: {
            uf
            
          }
        });


        modal.onDidDismiss().then((dados) => {
          console.log(dados)
          if(dados !== undefined)
          {
            this.dadosEmpresa.endereco.codigoIbgeCidade =  dados.data.codigo
            this.dadosEmpresa.endereco.cidade = dados.data.nome
          }
        })

        return await modal.present();
      
    }
    else

    {
      this.design.presentToast(
        'Seleciona UF antes de consulta cidades',
        'secondary',
        3000
      )
    }
    


  }

}
