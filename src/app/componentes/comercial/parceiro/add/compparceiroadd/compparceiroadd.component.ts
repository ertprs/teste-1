import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { apps } from 'firebase';
import { ModalapoioconsultacidadePage } from 'src/app/modals/apoio/parceiros/modalapoioconsultacidade/modalapoioconsultacidade.page';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { UserService } from 'src/app/services/global/user.service';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';

@Component({
  selector: 'app-compparceiroadd',
  templateUrl: './compparceiroadd.component.html',
  styleUrls: ['./compparceiroadd.component.scss'],
})
export class CompparceiroaddComponent implements OnInit {

  @Input() data: any;
  private viewConsulta:boolean = true;
  private parceiroUid:string
  private dadosConsulta = {
    documento:'',
    cep:'',
    dtNascimento:''
  }
  private dadosParceiro = {
    libCPF:false,
    libCNPJ:false,
    libCadastro:false,
    sincronizado:0,
    qtdAcoesFiscais:0,
    qtdAcoesFinanceiras:0,
    documento:'',
    dtNascimento:'',
   
    razaoSocial:'',
    nomeFantasia:'',
    documentoSituacao:'',
    documentoData:'',
    documentoComprovanteNumero:'',
    dataAbertura:'',
    empresaSituacao:'',
    inscricaoIE:'',
    inscricaoIM:'',
    inscricaoSUFRAMA:'',
    contato:{
      telefone:'',
      site:'',
      email:''
    },
    endereco:{
      cep:'',
      logradouro:'',
      endereco:'',
      numero:'',
      complemento:'',
      bairro:'',
      cidade:'',
      ibgeCOd:'',
      estado:''
    },
    enderecoCob:{
      cep:'',
      logradouro:'',
      endereco:'',
      numero:'',
      complemento:'',
      bairro:'',
      cidade:'',
      ibgeCOd:'',
      estado:''
    },
    enderecoEntrega:{
      cep:'',
      logradouro:'',
      endereco:'',
      numero:'',
      complemento:'',
      bairro:'',
      cidade:'',
      ibgeCOd:'',
      estado:''
    },
    geoLocalizacao:'',
    uidLara:'',
    credito:{
      liberado:false,
      valorLiberado:0,
      valorUtilizado:0,
      dtLiberacao:0,
      usuarioUid:'',
      usuarioNome:''
    },
    confFiscal:{
      tipoDoc:'nf',
      observacoesNota:''
    },
    confFinanceiro:{
      pagamentoBoleto:false,
      pagamentoCartao:false,
      observacoesBoleto:''
    },
    confContabil:{
      contaUid:'',
      contaNome:'',
      centrodecustoUid:'',
      centrodecustoNome:''
    },
    cadastroLibNota:false,
    representanteUid:'',
    representanteNome:'',
    situacaoCadastro:true

  }
  private UFs = []
  private Logradouros = []
  constructor(
    private eventEmitterService:ProvEmitterEventService,
    private srvParceiro:ParceirosService,
    private design:ProcessosService,
    private global:UserService,
    private ctrlModal:ModalController
  ) { }

  ngOnInit() {

    this.UFs = this.global.UFs
    this.Logradouros = this.global.Logradouros
    console.log(this.data)

    if(this.data.parceiroUid)
    {
      this.parceiroAbrir(this.data.parceiroUid)
    }

  }
  
  parceiroAbrir(uid:string)
  {
    this.design.presentLoading('Carregando dados...')
      .then(resLoading=>{
        resLoading.present()
        this.parceiroUid = uid
        this.srvParceiro.parceirosGet(this.parceiroUid)
        .then(resDados=>{
          this.dadosParceiro = resDados
          this.viewConsulta = false
        })
        .catch(err=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao abrir dados do cadastro',
            'danger',
            0,
            true
          )
          this.functionExecute('compComercialHome',{})
        })
        .finally(()=>{
          resLoading.dismiss()
         
        })
      })
  }
  parceiroDelete()
  {
    if(this.dadosParceiro.qtdAcoesFinanceiras == 0 && this.dadosParceiro.qtdAcoesFiscais == 0)
    { 
      this.design.presentAlertConfirm(
        'Confirmação',
        'Confirma excluir este conteto',
        'Sim',
        'Não'
      )
      .then(resConfirm=>{
        if(resConfirm)
        {
          this.design.presentLoading('Excluindo, aguarde ...')
          .then(resLoading=>{
            resLoading.present()
            this.srvParceiro.parceiroDelete(this.parceiroUid)
            .then(resDelete=>{
              this.design.presentToast(
                'Excluido com sucesso',
                'success',
                4000
              )
              this.functionExecute('compComercialHome',{})
            })
            .catch(errDelete=>{
              console.log(errDelete)
              this.design.presentToast(
                'Falha ao tentar excluir contato',
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
    else
    {
      this.design.presentToast(
        'Você não pode excluir este parceiro, porque ele já possui movimentações financeiras ou fiscais. Sugiro que você faça o bloqueio dele',
        'warning',
        0,
        true
      )
    }
   
  }
  parceiroAtualizar()
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Tem certeza de atualizar este cadastro?',
      'Tenho',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading("Atualizando...")
        .then(resLoading=>{
          resLoading.present()
          this.srvParceiro.parceiroAtualizar(this.parceiroUid,this.dadosParceiro)
          .then(resUpdate=>{
            this.design.presentToast(
              'Atualizado com sucesso',
              'success',
              3000
            )
          })
          .catch(errUpdate=>{
            console.log(errUpdate)
            this.design.presentToast(
              'Falha ao atualizar cadastro',
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
  parceiroAdd()
  {
    this.design.presentAlertConfirm(
      'Confirmação',
      'Você confirma adicionar este parceiro ?',
      'Claro',
      'Nem pensar!'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        
        this.design.presentLoading('Cadastrando, aguarde...')
        .then(resLoading=>{
          resLoading.present()


          this.srvParceiro.verificarSeExisteDocumento(this.dadosParceiro.documento)


          this.srvParceiro.add(this.dadosParceiro)
          .then(res=>{
            this.parceiroUid = res.id
            this.design.presentToast(
              'Cadastrado com sucesso',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao adicionar parceiro',
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
  limparCampo(event:any,apenas:any)
  {
    
    if(apenas === 'number')
    {
      event.target.value = event.target.value.replace(/[^0-9]*/g, '');
    }
  }
  functionExecute(functionName:string,params:any)
  {
    const param = {
      function:functionName,
      data:params
    };
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  sanitizarDado(valorstring:string)
  {
    let limpando = valorstring
    limpando =  limpando.split('.').join('')
    limpando =  limpando.split('-').join('')
    limpando =  limpando.split('/').join('')
    limpando =  limpando.split(' ').join('');
   
    return limpando
  }
  validarDadosCPF(documento:string):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      this.design.presentLoading('Aguarde, validando dados...')
      .then(resLoading=>{
        resLoading.present()
    
        const dtNascimento0 = this.dadosConsulta.dtNascimento
      
        const dtNascimento1 = dtNascimento0.split('-')
      
        const dtNascimento2 = dtNascimento1[2]+'/'+dtNascimento1[1]+'/'+dtNascimento1[0]

        this.srvParceiro.checkCPF(documento,dtNascimento2).then(res=>{

        if(res.situacao === 'suc')
        {  
          if(res.data.status)
          {
            const result = res.data.result

            this.dadosParceiro.documentoComprovanteNumero = result.comprovante_emitido
            this.dadosParceiro.razaoSocial = result.nome_da_pf
            this.dadosParceiro.nomeFantasia = result.nome_da_pf.split(' ')[0]
            this.dadosParceiro.documentoSituacao = result.situacao_cadastral
            this.dadosParceiro.documentoData = result.comprovante_emitido_data
          }
          resolve()
        }
        else
        {
          console.log(res)
          reject(res)
            
        }
        
        


          
        })
        .catch(err=>{
          console.log(err)
          reject(err)
        })
        .finally(()=>{
          resLoading.dismiss()
          this.dadosParceiro.libCPF = true
        })
      })
    })
    
  }
  validarDadosCNPJ(documento:string):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      const documento0 = documento
      const documento1 = this.sanitizarDado(documento0)
      this.design.presentLoading('Validando dados...')
      .then(resLoading=>{
        resLoading.present()
        this.srvParceiro.checkCNPJ(documento1)
        .then(resCheck=>{
          console.log(resCheck)

          if(resCheck.data.status)
          {
            const dadosRetorno                      = resCheck.data.result
            this.dadosParceiro.razaoSocial          = dadosRetorno.nome
            this.dadosParceiro.nomeFantasia         = dadosRetorno.fantasia
            this.dadosParceiro.dataAbertura         = dadosRetorno.abertura
            this.dadosParceiro.empresaSituacao      = dadosRetorno.situacao


            this.dadosParceiro.endereco.cep         = this.sanitizarDado( dadosRetorno.cep )
            this.dadosParceiro.endereco.bairro      = dadosRetorno.bairro
            this.dadosParceiro.endereco.cidade      = dadosRetorno.municipio 
            this.dadosParceiro.endereco.complemento = dadosRetorno.complemento
            this.dadosParceiro.endereco.endereco    = dadosRetorno.logradouro
            this.dadosParceiro.endereco.estado      = dadosRetorno.uf
            this.dadosParceiro.endereco.ibgeCOd     = '',
            this.dadosParceiro.endereco.logradouro  = dadosRetorno.logradouro.split(' ')[0].substring(0,3).toLowerCase()
            this.dadosParceiro.endereco.numero      = dadosRetorno.numero
          }

          console.log(resCheck)
          resolve(resCheck)
        })
        .catch(errCheck=>{
          console.log(errCheck)
          reject()
        })
        .finally(()=>{
          resLoading.dismiss()
          reject()
        })
      })
      
    })
  }
  validarDados()
  {
   
    const valorDocumento = this.sanitizarDado(this.dadosConsulta.documento)

    //SET DOCUMENTO 
    this.dadosParceiro.documento = valorDocumento


    //VERIFICAR SE DOCUMENTO JA ESTA CADASTRADO
    this.design.presentLoading('Verificando documento...')
    .then(resLoading=>{
      resLoading.present()

      this.srvParceiro.verificarSeExisteDocumento(this.sanitizarDado(valorDocumento)).then(ResVerifica=>{
        console.log("0)"+JSON.stringify( ResVerifica))
        if(ResVerifica.situacao == 'suc')
        {
          const data  = ResVerifica.data.data[0]
          console.log(data)
          if(data.length == 0)
          {
            if(valorDocumento.length == 11)
            {
              this.dadosParceiro.libCNPJ = false
              //CPF
              this.validarDadosCPF(valorDocumento).then(res=>{
                
                this.consultarCep(this.dadosConsulta.cep).then(resCep=>{
                
                  if(resCep.situacao == 'suc')
                  {
                    const dados = resCep.data
                
                  
                    this.dadosParceiro.endereco.cep           = this.sanitizarDado(dados.cep)
                    this.dadosParceiro.endereco.bairro        = dados.bairro
                    this.dadosParceiro.endereco.cidade        = dados.localidade
                    this.dadosParceiro.endereco.complemento   = dados.complemento
                    this.dadosParceiro.endereco.endereco      = dados.logradouro
                    this.dadosParceiro.endereco.logradouro    = dados.logradouro.split(' ')[0].substring(0,3).toLowerCase()
                    this.dadosParceiro.endereco.estado        = dados.uf
                    this.dadosParceiro.endereco.ibgeCOd       = dados.ibge
                    
                    this.dadosParceiro.endereco.numero        = ""
          
                    //LIBERARAR CADASTRO
              
                  }
                  else
                  {
                    //LIBERARAR CADASTRO
                  
                    this.design.presentToast(
                      'Houve um problema ao consultar CEP',
                      'warning',
                      0,
                      true
                    )
                  }
                
                })
                .catch(errCEP=>{
                
                  console.log(errCEP)
                  this.design.presentToast(
                  'Houve uma falha ao processar a consulta de CEP. Verifique se informou os dados corretamente',
                  'warning',
                  3000
                  
                )
                })
                .finally(()=>{
                  this.dadosParceiro.libCadastro = true
                })
              })
              .catch(err=>{
                //LIBERARAR CADASTRO
                this.dadosParceiro.libCadastro = true

                console.log(err)
                this.design.presentToast(
                  'Houve uma falha ao processar a consulta. Verifique se informou os dados corretamente',
                  'warning',
                  0,
                  true
                )
              })
              .finally(()=>{
                this.dadosParceiro.libCadastro = true
                this.viewConsulta              = false
              })
            }
            else
            {
              this.dadosParceiro.libCPF = false;
              
              this.validarDadosCNPJ(valorDocumento)
              .then(resCnpj=>{
                this.consultarCep(this.dadosParceiro.endereco.cep).then(resCep=>{
                
                  if(resCep.situacao == 'suc')
                  {
                    const dados = resCep.data

                    this.dadosParceiro.endereco.cep           = this.sanitizarDado(dados.cep)
                    this.dadosParceiro.endereco.bairro        = dados.bairro
                    this.dadosParceiro.endereco.cidade        = dados.localidade
                    //this.dadosParceiro.endereco.complemento   = dados.complemento
                    this.dadosParceiro.endereco.endereco      = dados.logradouro
                    this.dadosParceiro.endereco.logradouro    = dados.logradouro.split(' ')[0].substring(0,3).toLowerCase()
                    this.dadosParceiro.endereco.estado        = dados.uf
                    this.dadosParceiro.endereco.ibgeCOd       = dados.ibge
                    
                    //this.dadosParceiro.endereco.numero        = ""

                  }
                })
                .catch(errCep=>{
                  console.log(errCep)
                })
                .finally(()=>{

                })
                
              })
              .catch(err=>{

              })
              .finally(()=>{
                this.dadosParceiro.libCNPJ      = true
                this.dadosParceiro.libCadastro  = true
                this.viewConsulta               = false
                this.consultarCep(this.dadosConsulta.cep)
                .then(resCep=>{
                  if(resCep.situacao == 'suc')
                  {
                    const dados = resCep.data
                    this.dadosParceiro.endereco.ibgeCOd = dados.ibge
                    this.dadosParceiro.endereco.endereco = dados.logradouro
                    this.dadosParceiro.endereco.logradouro = dados.logradouro.split(' ')[0].substring(0,3).toLowerCase()
                  }
                  
                })
                .catch(err=>{
                  console.log(err)
                })
              })
            }
          }
          else
          {
            this.design.presentAlertConfirm(
              'Atenção',
              'Já existe um cadastro com esses dados. Deseja visualizar os cadastro agora?',
              'SIM',
              'Não'
            )
            .then(resConfirm=>{
              if(resConfirm)
              {
           
                this.parceiroAbrir(data[0].uid)
              }
              else
              {
                this.functionExecute('compComercialHome',{})
              }
            })
          }
        }
        else
        {
          
        }
      })
      .catch(errVerifica=>{
        console.log(errVerifica)
      })
      .finally(()=>{
        resLoading.dismiss()
      })
    })
    
    


    
  }


  q
  consultarCep(cep:string):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      const dado = this.sanitizarDado(cep)
      if(dado.length === 8)
      {
        this.design.presentLoading('Consultando CEP, aguarde ...')
        .then(resLoading=>{
          resLoading.present()
          
          this.srvParceiro.checkCEPv2(dado).then(res=>{
            
            resolve(res)
          })
          .catch(err=>{
            console.log(err)
            reject()
          })
          .finally(()=>{
            resLoading.dismiss()

          })

        })
        
      }
      else
      {
        reject()
      }
    })
    
   
  }
  limparCidades()
  {
    this.dadosParceiro.endereco.cidade    = ''
    this.dadosParceiro.endereco.ibgeCOd   = ''
  }
  async abrirConsultaCidade()
  {
    const uf = this.dadosParceiro.endereco.estado
    if(uf.length == 2)
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
            this.dadosParceiro.endereco.ibgeCOd = dados.data.codigo
            this.dadosParceiro.endereco.cidade = dados.data.nome
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
